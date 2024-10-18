// Public
export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    const online = await onlineOrgUsers(id)
    return apiSuccess(online)
})

const onlineOrgUsers = async (id) => {
    const query = `
        MATCH (o:Organization)
        WHERE o.id =~ $id
        WITH o as org
        RETURN COLLECT {
                    MATCH (s:Status)<-[r:HAS_STATUS]-(c:Citizen)-[:MEMBER_OF]->(org)
                    WHERE c.verified = true
                    return c as citizen
                } as citizens
    `

    const { result } = await readQuery(query, {
        id: '(?i)' + id.toUpperCase()
    })

    const online = []

    for (const res of result) {
        for (const citizen of res.citizens) {
            online.push(await getCitizen(citizen.properties.id))
        }
    }

    return online
}