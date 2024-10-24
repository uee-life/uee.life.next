// Public
export default defineEventHandler(async (event) => {
    const online = {
        all: [],
        org: [],
        friends: []
    }

    online.org = await onlineUsers()
    return apiSuccess(online)
})

const onlineUsers = async () => {
    const query = 
        `MATCH (c:Citizen)-[r:HAS_STATUS]->(s:Status {type: 'active'})
            WHERE r.updated > datetime() - duration('PT30M')
            RETURN count(c) as count, c as online`
    const { result } = await readQuery(query)
    const online = []

    for (const res of result) {
        online.push(await getCitizen(res.online.handle))
    }
    return online
}

const onlineOrgUsers = async () => {
    const query = `
        MATCH (o:Organization)<-[:MEMBER_OF]-(c:Citizen {handle: $handle})
        WITH o as org
        RETURN org,
                COLLECT {
                    MATCH (s:Status)<-[r:HAS_STATUS]-(c:Citizen)-[:MEMBER_OF]->(org)
                    return c as citizen
                } as citizens
    `

    const { result } = await readQuery(query, {
        handle: 'Capn_Flint'
    })

    const online = {
        name: '',
        citizens: []
    }

    for (const res of result) {
        online.name = res.org
        for (const citizen of res.citizens) {
            online.citizens.push(await getCitizen(citizen.properties.id))
        }
    }

    return online
}