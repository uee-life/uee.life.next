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
        `MERGE (s:System {rsi_id: $id})
         set s :Location
         SET s = {
            rsi_id: $id, 
            name: $name, 
            type: "SYSTEM",
            subtype: $type,
            affiliation: $affiliation,
            description: $description,
            image_url: $image_url,
            danger: $danger,
            economy: $economy,
            population: $population,
            designation: $name,
            rsi_code: $code,
            code: $code,
            official: true
        }
        RETURN s`
    const params = { 
        id: system.id,
        name: system.name,
        code: system.code,
        affiliation: system.affiliation[0].code.toUpperCase(),
        description: system.description,
        type: fixTypes(system.type),
        size: system.aggregated_size,
        population: system.aggregated_population,
        economy: system.aggregated_economy,
        danger: system.aggregated_danger,
        image_url: system.thumbnail ? system.thumbnail.source : ""
    }
    const result = await writeQuery(query, params)
    return result
}

async function create_and_link_object(object, type) {
    const query =
        `MATCH (parent { rsi_id: $parent_id }) 
         MERGE (child:Location:${type} { rsi_id: $rsi_id })
         SET child = { 
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
            system: $system,
            official: true
         }
         MERGE (child)-[:ORBITS]->(parent)
         RETURN child`
    
    const params = object
    const error = await writeQuery(query, params)
    if (error) {
        console.error(error)
    }
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

    //const species = await loadSpecies(rsi.species.resultset)
    //const affiliations = await loadAffiliations(rsi.affiliations.resultset)
    const systems = await loadSystems(rsi.systems.resultset)
    const jumps = await loadJumps(rsi.tunnels.resultset)
    
    return {
        result: 'success',
        systems: systems
    }
}

async function loadSystems(systemdata) {
    const systems = {}

    const count = {
        systems: 0,
        planets: 0,
        moons: 0,
        pois: 0,
        poiList: []
    }

    await Promise.all(systemdata.map(async (system) => {
        count.systems += 1
        systems[system.code] = system
        create_system(system)
        const objects = await getObjects(system)

        // get LZ's and other planetary POIs
        for (const planet of objects.planets) {
            const res = await getObjects(planet)
            objects.pois = objects.pois.concat(res.pois)
        }

        systems[system.code].planets = objects.planets
        systems[system.code].moons = objects.moons
        systems[system.code].pois = objects.pois

        // gotta do these in order ot make sure the planets are created before we try to link the moons.
        for await (const object of objects.planets) {
            count.planets += 1
            await create_and_link_object(object, "PLANET")
        }

        for await (const object of objects.moons) {
            count.moons += 1
            await create_and_link_object(object, "MOON")
        }

        for await (const object of objects.pois) {
            count.pois += 1
            await create_and_link_object(object, "POI")
        }

        console.log("System Done: ", system.name, " POIS: ", objects.pois.length)
    }))
    console.log("All done!")
    console.log("Counts: ", count)
    return systems
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

function fixTypes(type) {
    let result = type
    const replaces = [
        ["SYSTEM", "System"],
        ["PLANET", "Planet"],
        ["SATELLITE", "Moon"],
        ["JUMPPOINT", "Jump Point"],
        ["ASTEROID_BELT", "Asteroid Belt"],
        ["ASTEROID_FIELD", "Asteroid Field"],
        ["MANMADE", "Station"],
        ["BLACKHOLE", "Black Hole"],
        ["LZ", "Landing Zone"],
        ["SINGLE_STAR", "Star System"],
        ["BINARY_STAR", "Binary Star System"],
    ]
    replaces.forEach(([from, to]) => {
        result = result.replace(from, to)
    })
    return result
}

function sanitize(text) {
    // These code replaces are super hacky, to get around some bad data issues from the starmap. grrr.
    let result = text
    const replaces = [
        ["\u2019", "'"],
        ["\u0101", "a"],
        ["\u016b", "u"],
        ["\u0113", "e"]
    ]
    replaces.forEach(([from, to]) => {
        result = result.replace(from, to)
    })
    return result
}

function buildObject(item, system, affiliation = "None") {
    const object = {
        rsi_id: item.id,
        habitable: item.habitable ? true : false,
        image_url: item.thumbnail ? item.thumbnail.source : "",
        danger: Number(item.sensor_danger) ? Number(item.sensor_danger) : 0,
        economy: Number(item.sensor_economy) ? Number(item.sensor_economy) : 0,
        population: Number(item.sensor_population) ? Number(item.sensor_population) : 0,
        parent_id: ["PLANET","JUMPPOINT"].includes(item.type) || [50,74].includes(item.subtype_id) || item.parent_id == null ? system.id : item.parent_id, // subtype_id of 50 = system belt, 74 = system cluster
        designation: sanitize(item.designation),
        name: sanitize(item.name ? item.name : item.designation),
        description: sanitize(item.description ? item.description : ""),
        fairchance: item.fairchanceact ? true : false,
        type: fixTypes(item.type),
        subtype: item.subtype ? fixTypes(item.subtype.name) : "",
        subtype_id: item.subtype ? item.subtype.id : -1,
        affiliation: item.affiliation[0] ? item.affiliation[0].code.toUpperCase() : affiliation,
        rsi_code: item.code, // need this unmodified for starmap linking
        code: item.code ? item.code.replace(",",".") : item.name.replace(/\s/g, '').toUpperCase(),
        system_id: system.id,
        system: system.code
    }
    return object
}

async function getObjects(location) {
    let system = location
    let url = ""
    if (location.type == "Planet") {
        url = `https://robertsspaceindustries.com/api/starmap/celestial-objects/${location.rsi_code}`
        system = location.system
    } else {
        url = `https://robertsspaceindustries.com/api/starmap/star-systems/${location.code}`
    }

    const objects = {
        planets: [],
        moons: [],
        pois: []
    }

    //TODO: Add error handling in case the RSI api call fails.
    const resp = await $fetch(url, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        onResponse(_ctx) {
            const result = _ctx.response._data.data.resultset[0]
            if (result) {
                if (location.type == "Planet") { // Planets
                    if (result.children) {
                        result.children.forEach(item => {
                            const affiliation = result.affiliation[0] ? result.affiliation[0].code.toUpperCase() : null
                            if(["LZ"].includes(item.type)) {
                                objects.pois.push(buildObject(item, {id: location.system_id, code: location.system}, affiliation))
                            } else {
                                //console.log("UNMANAGED PLANET LOC: ", item.type)
                            }
                        })
                    }
                } else { // Systems
                    // get the star ID, so we can swap out the system ID to fix linking issues.
                    const idx = result.celestial_objects.findIndex((element) => element.type == "STAR")
                    let star_id = 1
                    if(idx >= 0) {
                        star_id = result.celestial_objects[idx].id
                    }
                    result.celestial_objects.forEach(async item => {
                        if(["PLANET", "SATELLITE", "JUMPPOINT", "ASTEROID_BELT", "ASTEROID_FIELD", "MANMADE", "BLACKHOLE", "POI"].includes(item.type)) {
                            if(item.parent_id == star_id) {
                                item.parent_id = system.id
                            }
                            const object = buildObject(item, system)

                            if(object.subtype_id == 52) {
                                objects.moons.push(object)
                            } else if (object.type == "Planet") {
                                objects.planets.push(object)
                            } else {
                                objects.pois.push(object)
                            }
                        } else {
                            // types: STAR, BLACKHOLE
                            if(item.type != "STAR") {
                                console.log("UNMANAGED ORBITAL TYPE: ", item.type)
                                console.log(item)
                            }
                        }
                    })
                }
            } else {
                console.error(`Error with ${location.type}: ${location.rsi_code}`)
            }
        },
        onResponseError(_ctx) {
            console.error(_ctx.response.error)
        }
    })
    return objects
}