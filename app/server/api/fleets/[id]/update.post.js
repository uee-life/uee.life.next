export default defineAuthenticatedEventHandler(async (event) => {
    const user = await loadUser(event.context.user)
    const groupID = getRouterParam(event, 'id')
    const group = await readBody(event)
    console.log(group)

    // TODO: add a check here to authorize creation of the subgroup 
    // (parent cmdr, or org director)

    // get citizen info, and create the entity if it doesn't exist yet
    if (group) {
        const newGroup = await updateGroup(groupID, group)
        clearCommander(groupID)
        if (group.cmdr) {
            console.log('GOT CMDR: ' + group.cmdr)
            const cmdr = await getCitizen(group.cmdr, true)
            await addCommander(cmdr, groupID)
        }
        return apiSuccess("Group updated")
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