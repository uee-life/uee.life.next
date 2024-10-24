// Authenticated
// Authorized: Parent group admins
export default defineAuthenticatedEventHandler(async (event) => {
    const user = await loadUser(event.context.user)
    const parentID = getRouterParam(event, 'id')
    const group = await readBody(event)

    // TODO: add a check here to authorize creation of the subgroup 
    // (parent cmdr, or org director)

    // get citizen info, and create the entity if it doesn't exist yet
    if (group) {
        const parentVG = await getVehicleGroup(parentID)

        if (user && user.verified && parentVG.admins.some(e => e.handle == user.handle)) {
            const newGroupID = await addGroup(parentID, group)
            if (!newGroupID) {
                console.error(`Couldn't create new group`)
                return apiError(`Couldn't create new group`, 400)
            } else {
                if (group.cmdr) {
                    const cmdr = await getCitizen(group.cmdr, true)
                    addCommander(cmdr, newGroupID)
                }
                return apiSuccess("Group updated")
            }
        } else {
            return accessDenied(event)
        }
        
    } else {
        return apiError(event, 400)
    }
})

const addGroup = async (parentID, group) => {
    const query = `
        MATCH (parent:VehicleGroup {id: $id})
        MERGE (g:VehicleGroup {name: $name})
        MERGE (g)-[:PART_OF]->(parent)
        SET g = {
            id: toUpper(left(randomUUID(), 8)),
            name: $name,
            purpose: $purpose,
            cmdr: $cmdr
        }
        RETURN g.id as groupID`
    
    const { result, error } = await writeQuery(query, {
        name: group.name,
        purpose: group.purpose,
        cmdr: group.cmdr,
        id: parentID
    })

    if (error) {
        return null
    } else {
        return result[0].groupID
    }
}