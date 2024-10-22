// Public
export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    const online = await onlineOrgUsers(id)
    return apiSuccess(online)
})

const onlineOrgUsers = async (id, user=null) => {
    const query = `
        MATCH (o:Organization)
        WHERE o.id =~ $id
        WITH o as org
        MATCH (s:Status)<-[r:HAS_STATUS]-(c:Citizen)-[:MEMBER_OF]->(org)
        WHERE c.verified = true
        call {
            WITH c
            OPTIONAL MATCH (c)-[r:FRIENDS_WITH]->(u:Citizen)
            WHERE u.id =~ $user
            return r.confirmed as received
        }
        call {
            WITH c
            OPTIONAL MATCH (c)<-[s:FRIENDS_WITH]-(u:Citizen)
            WHERE u.id =~ $user
            RETURN s.confirmed as sent
        }
        RETURN c as citizen, r.updated as status, sent, received
    `

    const { result } = await readQuery(query, {
        id: '(?i)' + id.toUpperCase(),
        user: user
    })

    const online = []

    for (const res of result) {
        const citizen = res.citizen
        citizen.status = parseStatus(res.status)
        if (result[0].sent != null) {
            if (result[0].sent) {
                citizen.friendship = 'confirmed'
            } else {
                citizen.friendship = 'requested'
            }
        } else if (result[0].received != null) {
            if (result[0].received) {
                citizen.friendship = 'confirmed'
            } else {
                citizen.friendship = 'received'
            }
        }
        online.push(citizen)
    }

    return online
}