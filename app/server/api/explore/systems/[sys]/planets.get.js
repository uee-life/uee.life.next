import { readQuery, writeQuery } from "~/server/helpers/neo4j"

export default defineEventHandler(async (event) => {
    const tag = getRouterParam(event, 'sys')
    const query = "MATCH (planet:OrbitalBody {type: 'PLANET'})-[:ORBITS]->(s:System {code: $name}) return planet"
    console.log(query)
    const { result, error } =  await readQuery(query, { name: tag.toUpperCase() })
    const systems = []
    result.forEach(record => {
        systems.push(record._fields[0].properties)
    })
    return systems
})
