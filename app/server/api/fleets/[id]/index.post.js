export default defineAuthenticatedEventHandler(async (event) => {
    const user = await loadUser(event.context.user)
    const parentID = getRouterParam(event, 'id')
    const group = await readBody(event)

    // TODO: add a check here to authorize creation of the subgroup 
    // (parent cmdr, or org director)

    // get citizen info, and create the entity if it doesn't exist yet
    if (group) {
        console.log(group)
        const newGroupID = await addGroup(parentID, group)
        console.log(newGroupID)
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
        return apiError(event, 400)
    }
})

const addGroup = async (parentID, group) => {
    const query = `
        MATCH (parent:VehicleGroup {id: $id})
        MERGE (g:VehicleGroup {name: $name})
        MERGE (g)-[:BELONGS_TO]->(parent)
        SET g = {
            id: left(randomUUID(), 8),
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
        return result[0]._fields[0]
    }
}