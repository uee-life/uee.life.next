// Authenticated
// Authorized: Parent group admins
export default defineAuthenticatedEventHandler(async (event) => {
    const user = await loadUser(event.context.user)
    const parentID = getRouterParam(event, 'id')
    const group = await readBody(event)

    // TODO: add a check here to authorize creation of the subgroup 
    // (parent cmdr, or org director)

    // get citizen info, and create the entity if it doesn't exist yet
    if (group && user && user.verified) {

        const parentGroup = await getGroup(parentID)

        if (parentGroup.admins.some(e => e.handle == user.handle)) {
            const newGroupID = await createGroup(parentID, group)
            if (newGroupID && group.cmdr) {
                if (group.cmdr) {
                    assignGroupLeader(await getCitizen(group.cmdr, true), newGroupID, 'Group Leader')
                }
                return apiSuccess("Group updated")
            } else {
                logging.error(`Couldn't create new group`)
                return apiError(`Couldn't create new group`, 400)
            }
        } else {
            return accessDenied(event)
        }
        
    } else {
        return apiError(event, 400)
    }
})