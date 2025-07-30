// Authenticated
// Authorized: fleet group admin
export default defineAuthenticatedEventHandler(async (event) => {
    const user = await loadUser(event.context.user)
    const data = await readBody(event)

    const group = await getGroup(data.groupID)

    if (user && user.verified && group.admins.some(e => e.handle == user.handle)) {
        const error = await removeVehicle(data.vehicleID, data.groupID)
        if (error) {
            return apiError(event, `Something went wrong: ${error}`)
        } else {
            return apiSuccess("Assignment Removed")
        }
    } else {
        return accessDenied(event)
    }
})

const removeVehicle = async (vehicleID, groupID) => {
    // remove vehicles connection with the group
    // then delete any vehicle assignments associated with that group
    const query = `
        MATCH (v:Vehicle {id: $vehicleID})-[r:PART_OF]->(g:Group {id: $groupID})-[:BELONGS_TO | PART_OF]->{0,10}(o:Organization|Citizen)
        DELETE r
        WITH v, o
        OPTIONAL MATCH (o)<-[:OWNED_BY]-(a:Assignment)-[:ATTACHED_TO]->(v)
        DETACH DELETE a
    `

    const params = {
        vehicleID: vehicleID.toUpperCase(),
        groupID: groupID
    }

    const { result, error } = await writeQuery(query, params)
    if (error) {
        return error
    } else {
        if (result[0] && result[0].owner) {
            await clearAssignments(vehicleID, result[0].owner.id)
        }
        return null
    }
}