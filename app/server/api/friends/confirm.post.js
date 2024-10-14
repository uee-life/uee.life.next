
export default defineAuthenticatedEventHandler(async (event) => {
    const user = await loadUser(event.context.user)
    const body = readBody(event)

    const friends = await confirmFriend(user, body.friend)
})

const confirmFriend = async (user, friend) => {
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
        source: friend,
        target: user.handle
    })
}