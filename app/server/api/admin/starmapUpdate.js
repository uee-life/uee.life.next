import { readQuery, writeQuery } from "~/server/helpers/neo4j"

export default defineEventHandler(async (event) => {
    return getSystems()
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

async function create_and_link_planet(data, rsi_id, system_name) {
    const query =
        "MATCH (system:System { name: $system_name }) " +
        "MERGE (planet:Planet { rsi_id: $id, name: $planet_name, type: $planet_type}) " +
        "MERGE (planet)-[:ORBITS]->(system) " +
        "RETURN planet"
    
    const params = {id: rsi_id, system_name: system_name, planet_name: data['name'], planet_type: data['type']}
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

async function create_jump(source, destination, size) {
    const query =
        "MATCH (s1:System { name: $source }) " +
        "MATCH (s2:System { name: $destination }) " +
        "MERGE (s1)-[:JUMP_POINT { size: $size }]->(s2) " +
        "MERGE (s2)-[:JUMP_POINT { size: $size }]->(s1) " +
        "RETURN s1,s2"
    const params = { source: source, destination: destination, size: size }
    await writeQuery(query, params)
}

// RSI functions

async function getSystems() {
    const url = "https://robertsspaceindustries.com/api/starmap/bootup"

    const resp = await $fetch(url, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    const result = resp.data.systems.resultset
    const systems = {}

    result.forEach(item => {
        systems[item.code] = item
        create_system(item)
    })

    return systems
}