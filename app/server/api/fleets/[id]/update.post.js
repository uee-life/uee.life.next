// Authenticated
// Authorized: fleet group admin
export default defineAuthenticatedEventHandler(async (event) => {
    const user = await loadUser(event.context.user)
    const groupID = getRouterParam(event, 'id')
    const groupData = await readBody(event)

    if (groupData) {
        const group = await getVehicleGroup(groupID, false)
        if (user && user.verified && group.admins.some(e => e.handle == user.handle)) {
            const newGroup = await updateGroup(groupID, groupData)
            console.log(newGroup)
            clearCommander(groupID)
            if (newGroup.cmdr) {
                console.log('GOT CMDR: ' + newGroup.cmdr)
                const cmdr = await getCitizen(newGroup.cmdr, true)
                await addCommander(cmdr, groupID)
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
        MATCH (g:VehicleGroup {id: $id})
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