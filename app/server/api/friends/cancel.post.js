export default defineAuthenticatedEventHandler(async (event) => {
    const user = await loadUser(event.context.user)
    const body = await readBody(event)

    console.log(body)

    const error = await cancelFriend(user, body.friend)
    if (error) {
        return apiError(event, 'unable to cancel friend request')
    } else {
        return apiSuccess(event, 'Friend removed!')
    }
})

const cancelFriend = async (user, friend) => {
    console.log('cancelling friend', friend, user.handle)
    const query = `
        MATCH (source:Citizen)-[r:FRIENDS_WITH]->(target:Citizen)
        WHERE source.id =~ $source
        AND target.id =~ $target
        DELETE r
    `

    const { error } = await writeQuery(query, {
        source: '(?i)'+friend,
        target: '(?i)'+user.handle
    })
    return error
}