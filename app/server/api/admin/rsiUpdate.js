import { readQuery, writeQuery } from "~/server/utils/neo4j"

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
            affiliation: $affiliation,
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
        affiliation: system.affiliation[0].code.toUpperCase(),
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

async function create_and_link_object(object) {
    const query =
        `MATCH (parent { rsi_id: $parent_id }) 
         MERGE (child:Location:OrbitalBody { 
            rsi_id: $rsi_id, 
            name: $name, 
            type: $type,
            subtype: $subtype,
            affiliation: $affiliation,
            habitable: $habitable,
            description: $description,
            image_url: $image_url,
            danger: $danger,
            economy: $economy,
            population: $population,
            designation: $designation,
            fairchance: $fairchance,
            rsi_code: $rsi_code,
            code: $code,
            system: $system
         })
         MERGE (child)-[:ORBITS]->(parent)
         RETURN child`
    
    const params = object
    const error = await writeQuery(query, params)
}

async function create_jump(data) {
    const query =
        "MATCH (s1:System { code: $source }) " +
        "MATCH (s2:System { code: $destination }) " +
        "MERGE (s1)-[:JUMP_POINT { size: $size }]->(s2) " +
        "MERGE (s2)-[:JUMP_POINT { size: $size }]->(s1) " +
        "RETURN s1,s2"
    const params = { source: data.source, destination: data.destination, size: data.size }
    const error = await writeQuery(query, params)
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

    //systemdata.forEach(async system => {
    await Promise.all(systemdata.map(async (system) => {
        count.systems += 1
        systems[system.code] = system
        create_system(system)
        const objects = await getObjects(system)
        console.log("System Start: ", system.name)

        // gotta do these in order ot make sure the planets are created before we try to link the moons.
        for await (const object of objects.planets) {
            count.bodies += 1
            console.log("Planet: ",object.name, object.code)
            //console.log(body)
            //body.affiliation = body.affiliation[0].code
            await create_and_link_object(object)
        }
        console.log("planets done")

        for await (const object of objects.moons) {
            count.bodies += 1
            console.log("Moon: ", object.name, object.code, object.parent_id)
            //console.log(body)
            //body.affiliation = body.affiliation[0].code
            await create_and_link_object(object)
        }
        console.log("moons done")
    }))
    console.log("All done!")
    return count
}

async function loadJumps(jumpData) {
    console.log("creating jump points")
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
    console.log("Jumps done!")
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
        planets: [],
        moons: []
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
                    const object = {
                        rsi_id: item.id,
                        habitable: item.habitable ? true : false,
                        image_url: item.thumbnail ? item.thumbnail.source : "",
                        danger: Number(item.sensor_danger) ? Number(item.sensor_danger) : 0,
                        economy: Number(item.sensor_economy) ? Number(item.sensor_economy) : 0,
                        population: Number(item.sensor_population) ? Number(item.sensor_population) : 0,
                        parent_id: item.type == "PLANET" ? system.id : item.parent_id,
                        designation: item.designation,
                        name: item.name ? item.name : item.designation,
                        description: item.description ? item.description : "",
                        fairchance: item.fairchanceact ? true : false,
                        type: item.type,
                        subtype: item.subtype.name,
                        subtype_id: item.subtype.id,
                        affiliation: item.affiliation[0] ? item.affiliation[0].code.toUpperCase() : "Unknown",
                        rsi_code: item.code, // need this unmodified for starmap linking
                        code: item.code ? item.code.replace(",",".").replace("PLANET","").split(".").pop() : item.name.replace(/\s/g, '').toUpperCase(),
                        system: system.code
                    }

                    // The code replaces above are super hacky, to get around some bad data issues from the starmap. grrr.
        
                    // clean up weird characters
                    replaces.forEach((from, to) => {
                        object.name.replace(from, to)
                        object.designation.replace(from, to)
                        object.description.replace(from, to)
                    })
                    
                    if(object.subtype_id == 52) {
                        objects.moons.push(object)
                    } else {
                        objects.planets.push(object)
                    }
                    //objects.push(object)
                } else {
                    // types: STAR, JUMPPOINT, ASTEROID_BELT, BLACKHOLE, MANMADE
                }
            })
        }
    })
    return objects
}