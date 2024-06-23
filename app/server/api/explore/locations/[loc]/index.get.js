import { readQuery, writeQuery, parseRecords } from "~/server/utils/neo4j"

export default defineEventHandler(async (event) => {
    const tag = getRouterParam(event, 'loc')
    const query = "MATCH (location {code: $code}) return location"

    const { result, error } =  await readQuery(query, { code: tag.toUpperCase() })
    return result[0].location
})
