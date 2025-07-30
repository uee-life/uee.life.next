// Authenticated
// Authorized: fleet group admin
export default defineAuthenticatedEventHandler(async (event) => {
    const user = await loadUser(event.context.user)
    const data = await readBody(event)

    const group = await getGroup(data.groupID)

    if (user && user.verified && group.admins.some(e => e.handle == user.handle)) {
        const error = await removeMember(data.handle, data.groupID)
        if (error) {
            return apiError(event, `Something went wrong: ${error}`)
        } else {
            return apiSuccess("Assignment Removed")
        }
    } else {
        return accessDenied(event)
    }
})

const removeMember = async (handle, groupID) => {
    const query = `
        MATCH (c:Citizen)-[:ASSIGNED_TO]->(a:Assignment {type: 'Membership'})-[:ATTACHED_TO]->(:Group {id: $groupID})
        WHERE c.id =~ $handle
        DETACH DELETE a
    `

    const params = {
        handle: handle.toUpperCase(),
        groupID: groupID
    }

    const { error } = await writeQuery(query, params)
    if (error) {
        return error
    } else {
        return null
    }
}