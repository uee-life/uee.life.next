import { readQuery, writeQuery } from "~/server/helpers/neo4j"

export default defineEventHandler(async (event) => {
    const tag = getRouterParam(event, 'sys')
    const query = "MATCH (system:System {code: $code}) return system"

    const { result, error } =  await readQuery(query, { code: tag.toUpperCase() })

    let system = {}
    if(result.length > 0) {
        system = result[0]._fields[0].properties
    }

    return system
})
