import { readQuery, writeQuery } from "~/server/helpers/neo4j"

export default defineEventHandler(async (event) => {
    return bootstrap()
})

async function create_system(system) {
    /*
    system properties:
    - rsi_id - id
    - code - code
    - description - description
    - name - name
    - type - type
    - affiliation (connection) - affiliation.id
    - size - aggregated_size
    - population - aggregated_population
    - economy - aggregated_economy
    - danger - aggregated_danger
    - image_url - thumbnail.source (optional)
    */
    const query =
        `MERGE (s:System {
            rsi_id: $id, 
            name: $name, 
            code: $code, 
            description: $description, 
            type: $type,
            size: $size,
            population: $population,
            economy: $economy,
            danger: $danger,
            image_url: $image})
            RETURN s`
    const params = { 
        id: system.id,
        name: system.name,
        code: system.code,
        description: system.description,
        type: system.type,
        size: system.aggregated_size,
        population: system.aggregated_population,
        economy: system.aggregated_economy,
        danger: system.aggregated_danger,
        image: system.thumbnail ? system.thumbnail.source : ""
    }
    const result = await writeQuery(query, params)
    return result
}

async function create_and_link_planet(planet, system) {
    const query =
        `MATCH (system:System { code: $system_code }) 
         MERGE (planet:Planet { 
            rsi_id: $rsi_id, 
            name: $name, 
            type: $type,
            subtype: $subtype,
            habitable: $habitable,
            description: $description,
            thumbnail: $thumbnail,
            danger: $danger,
            economy: $economy,
            population: $population,
            designation: $designation,
            fairchance: $fairchance
        })
         MERGE (planet)-[:ORBITS]->(system)
         RETURN planet`
    
    const params = planet
    params.system_code = system
    const result = await writeQuery(query, params)
}

async function create_and_link_moon(data, rsi_id, parent) {
    const query = (
        "MATCH (planet:Planet { rsi_id: $parent }) " +
        "MERGE (moon:Moon { rsi_id: $id, name: $moon_name, type: $moon_type}) " +
        "MERGE (moon)-[:ORBITS]->(planet) " +
        "RETURN moon"
    )
    const params = {parent: parent, id: rsi_id, name: data.name, type: data.type}
    await writeQuery(query, params)
}

async function create_jump(data) {
    const query =
        "MATCH (s1:System { code: $source }) " +
        "MATCH (s2:System { code: $destination }) " +
        "MERGE (s1)-[:JUMP_POINT { size: $size }]->(s2) " +
        "MERGE (s2)-[:JUMP_POINT { size: $size }]->(s1) " +
        "RETURN s1,s2"
    const params = { source: data.source, destination: data.destination, size: data.size }
    await writeQuery(query, params)
}

// RSI functions

async function bootstrap() {
    const url = "https://robertsspaceindustries.com/api/starmap/bootup"

    const resp = await $fetch(url, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    const rsi = resp.data

    const {systems, bodies} = await loadSystems(rsi.systems.resultset)
    const jumps = await loadJumps(rsi.tunnels.resultset)
    return {
        systems: systems,
        bodies: bodies,
        jumps: jumps
    }
}

async function loadSystems(systemdata) {
    const systems = {}

    const count = {
        systems: 0,
        bodies: 0
    }

    systemdata.forEach(async system => {
        count.systems += 1
        systems[system.code] = system
        create_system(system)
        const objects = await getObjects(system)

        Object.entries(objects.planets).forEach(planet => {
            count.bodies += 1
            create_and_link_planet(objects.planets[planet[0]], system.code)
        })
    })
    return count
}

async function loadJumps(jumpData) {
    let count = 0
    jumpData.forEach(item => {
        count += 1
        const path = item.entry.code.split('.')
        const jump = {
            source: path[0],
            destination: path[2],
            size: item.size
        }
        create_jump(jump)
    })
    return count
}

async function getObjects(system) {
    const url = `https://robertsspaceindustries.com/api/starmap/star-systems/${system.code}`
    const replaces = [
        ["\u2019", "'"],
        ["\u0101", "a"],
        ["\u016b", "u"],
        ["\u0113", "e"]
    ]

    const objects = {
        planets: {},
        moons: {}
    }

    const resp = await $fetch(url, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        onResponse(_ctx) {
            const result = _ctx.response._data.data.resultset[0]
            result.celestial_objects.forEach(item => {
                if(["PLANET", "SATELLITE"].includes(item.type)) {
                    const object = {}
                    object.rsi_id = item.id
                    object.habitable = item.habitable ? true : false
                    object.thumbnail = item.thumbnail ? item.thumbnail.source : ""
                    object.danger = Number(item.sensor_danger) ? Number(item.sensor_danger) : 0
                    object.economy = Number(item.sensor_economy) ? Number(item.sensor_economy) : 0
                    object.population = Number(item.sensor_population) ? Number(item.sensor_population) : 0
                    object.parent_id = item.parent_id ? item.parent_id : system.id
                    object.designation = item.designation
                    object.name = item.name ? item.name : item.designation
                    object.description = item.description ? item.description : ""
                    object.fairchance = item.fairchanceact ? true : false
                    object.type = item.type
                    object.subtype = item.subtype.name
                    object.subtype_id = item.subtype.id
        
                    // clean up weird characters
                    replaces.forEach((from, to) => {
                        object.name.replace(from, to)
                        object.designation.replace(from, to)
                        object.description.replace(from, to)
                    })
                    
                    if(object.subtype_id == 52) {
                        objects.moons[object.name] = object
                    } else {
                        objects.planets[object.name] = object
                    }
                } else {
                    // types: STAR, JUMPPOINT, ASTEROID_BELT, BLACKHOLE, MANMADE
                }
            })
        }
    })
    return objects
}