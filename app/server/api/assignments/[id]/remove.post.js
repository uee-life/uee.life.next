export default defineAuthenticatedEventHandler(async (event) => {
    const user = await loadUser(event.context.user)
    const data = await readBody(event)
    const target = getRouterParam(event, 'id')

    if (user && user.verified) {
        if (checkAssignmentPerms(target, user)) {
            await removeCitizen(data, target)
        } else {
            return accessDenied(event)
        }
    } else {
        return apiError(event, "You must be verified to add ships to this account.")
    }
})

const removeCitizen = async (data, target) => {
    const query = `
        MATCH (c:Citizen)-[r:ASSIGNED_TO]->(a:Assignment)
        WHERE c.id =~ $handle
        AND a.id =~ $target
        DELETE r
    `

    const { error } = await writeQuery(query, {
        handle: data.handle,
        target: target
    })

    return error
}