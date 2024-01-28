import { readQuery, writeQuery } from "../../helpers/neo4j"

export default defineEventHandler(async (event) => {
    const tag = getRouterParam(event, 'tag')
    const res =  await readQuery('MATCH (system:System) return system')
    const systems = []
    res.forEach(record => {
        systems.push(record._fields[0].properties)
    })
    return systems
})
