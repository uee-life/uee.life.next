import { readQuery, writeQuery } from "~/server/utils/neo4j"

export default defineEventHandler(async (event) => {
    const tag = getRouterParam(event, 'tag')
    const { result, error } =  await readQuery('MATCH (system:System) return system')
    const systems = []
    result.forEach(record => {
        systems.push(record._fields[0].properties)
    })
    return systems
})
