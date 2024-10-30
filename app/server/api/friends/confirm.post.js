
export default defineAuthenticatedEventHandler(async (event) => {
    const user = await loadUser(event.context.user)
    const body = await readBody(event)
    console.log(body)

    const friends = await confirmFriend(user, body.friend)
})

const confirmFriend = async (user, friend) => {
    console.log('confirming friend', friend, user.handle)
    const query = `
        MATCH (source:Citizen)-[r:FRIENDS_WITH]->(target:Citizen)
        WHERE source.id =~ $source
        AND target.id =~ $target
        SET r = {
            confirmed: true,
            date: datetime()
        }
    `

    const { result } = await writeQuery(query, {
        source: '(?i)'+friend,
        target: '(?i)'+user.handle
    })
}