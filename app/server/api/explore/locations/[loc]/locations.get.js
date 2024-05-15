import { readQuery, writeQuery } from "~/server/utils/neo4j"

export default defineEventHandler(async (event) => {
    const code = getRouterParam(event, 'loc')
    const query = "MATCH (loc:Location)-[:ORBITS]->(s:Location {code: $code}) return loc"
    console.log(query)
    const { result, error } =  await readQuery(query, { code: code.toUpperCase() })
    const systems = []
    result.forEach(record => {
        systems.push(record._fields[0].properties)
    })
    return systems
})
