import { readQuery, writeQuery, parseRecords } from "~/server/utils/neo4j"

export default defineEventHandler(async (event) => {
    const tag = getRouterParam(event, 'loc')
    const query = "MATCH (location:Location {code: $code}) return location"

    const { result, error } =  await readQuery(query, { code: tag.toUpperCase() })
    return apiSuccess(result[0].location)
})
