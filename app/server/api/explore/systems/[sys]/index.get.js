import { readQuery, writeQuery } from "~/server/helpers/neo4j"

export default defineEventHandler(async (event) => {
    const tag = getRouterParam(event, 'sys')
    const query = "MATCH (system:System {name: $name}) return system"
    console.log(query)
    const res =  await readQuery(query, { name: tag.toUpperCase() })
    const system = res[0]._fields[0].properties
    return system
})
