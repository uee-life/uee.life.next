import { readQuery, writeQuery } from "~/server/helpers/neo4j"

export default defineEventHandler(async (event) => {
    const tag = getRouterParam(event, 'sys')
    const query = "MATCH (system:System {code: $code}) return system"

    const res =  await readQuery(query, { code: tag.toUpperCase() })

    let system = {}
    if(res.length > 0) {
        system = res[0]._fields[0].properties
    }

    return system
})
