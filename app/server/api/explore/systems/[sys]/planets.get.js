import { readQuery, writeQuery } from "~/server/helpers/neo4j"

export default defineEventHandler(async (event) => {
    const tag = getRouterParam(event, 'sys')
    const res =  await readQuery(`MATCH (planet:Planet)-[:ORBITS]->(s:System {name: '${tag}'}) return planet`)
    const systems = []
    res.forEach(record => {
        systems.push(record._fields[0].properties)
    })
    return systems
})
