
export default defineAuthenticatedEventHandler(async (event) => {
    const user = await loadUser(event.context.user)
    const body = await readBody(event)
    console.log(body)
    // get target citizen, and create the entity if needed.
    const target = await getCitizen(body.friend, true)

    const friends = await requestFriend(user, target)
})

const requestFriend = async (user, friend) => {
    console.log('friend requested by ', user.handle, 'to', friend.handle)
    const query = `
        MATCH (source:Citizen)
        WHERE source.id =~ $source
        MATCH (target:Citizen)
        WHERE target.id =~ $target
        WITH source, target
        MERGE (source)-[f:FRIENDS_WITH]->(target)
        SET f = {
            confirmed: false,
            date: datetime()
        }
    `

    const {result} = await writeQuery(query, {
        source: '(?i)' + user.handle,
        target: '(?i)' + friend.id
    })
}