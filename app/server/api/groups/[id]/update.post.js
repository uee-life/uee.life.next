// Authenticated
// Authorized: fleet group admin
export default defineAuthenticatedEventHandler(async (event) => {
    const user = await loadUser(event.context.user)
    const groupID = getRouterParam(event, 'id')
    const groupData = await readBody(event)

    if (groupData) {
        const group = await getGroup(groupID, false)
        if (user && user.verified && group.admins.some(e => e.handle == user.handle)) {
            const newGroup = await updateGroup(groupID, groupData)

            clearGroupLeaders(groupID)
            
            if (newGroup.cmdr) {
                const cmdr = await getCitizen(newGroup.cmdr, true)
                await assignGroupLeader(cmdr, groupID, 'Commander')
            }
            return apiSuccess("Group updated")        
        } else {
            return accessDenied(event)
        }
    } else {
        return apiError(event, 400)
    }
})

const updateGroup = async (groupID, group) => {
    const query = `
        MATCH (g:OrgGroup {id: $id})
        SET g = {
            id: $id,
            name: $name,
            purpose: $purpose,
            cmdr: $cmdr
        }
        RETURN g as info`
    
    const { result, error } = await writeQuery(query, {
        id: groupID,
        name: group.name,
        purpose: group.purpose,
        cmdr: group.cmdr
    })
    return result[0].info
}