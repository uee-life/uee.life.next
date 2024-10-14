
export default defineAuthenticatedEventHandler(async (event) => {
    const user = await loadUser(event.context.user)

    const friends = await getFriends(user)
    return apiSuccess(friends)
})

const getFriends = async (user) => {
    const friends = []
    const pending = []

    const query = `
        MATCH (c:Citizen)-[r:FRIENDS_WITH]-(friend:Citizen)
        MATCH (friend)-[s:HAS_STATUS]->(:Status {type: 'active'})
        WHERE c.id =~ $handle
        RETURN friend,
                r.confirmed as confirmed,
                s.updated as status

    `

    /*const query = `
        MATCH (c:Citizen)-[:FRIENDS_WITH]-(f:Citizen)-[s:HAS_STATUS]->(:Status {type: 'active'})
        WHERE c.id =~ $handle
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
    `*/

    const { result } = await readQuery(query, {
        handle: '(?i)' + user.handle
    })

    for (const res of result) {
        console.log("result", res)
        const citizen = await getCitizen(res.friend.handle, false, user)
        friends.push({
            ...citizen,
            status: parseStatus(res.status),
            confirmed: res.confirmed
        })
    }
    return friends
}