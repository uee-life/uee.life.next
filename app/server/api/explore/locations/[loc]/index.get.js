import { readQuery, writeQuery } from "~/server/utils/neo4j"

export default defineEventHandler(async (event) => {
    const tag = getRouterParam(event, 'loc')
    const query = "MATCH (location {code: $code}) return location"

    const { result, error } =  await readQuery(query, { code: tag.toUpperCase() })

    let system = {}
    if(result.length > 0) {
        system = result[0]._fields[0].properties
    }

    return system
})
