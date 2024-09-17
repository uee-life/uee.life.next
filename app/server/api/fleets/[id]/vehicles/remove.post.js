import { removeAssignment } from "~/server/utils/assignments"
import { getGroup } from "../index.get"

export default defineAuthenticatedEventHandler(async (event) => {
    const user = await loadUser(event.context.user)
    const data = await readBody(event)

    if (user && user.verified) {
        const error = await removeVehicle(data.vehicleID, data.groupID)
        if (error) {
            return apiError(event, `Something went wrong: ${error}`)
        } else {
            return apiSuccess("Assignment Removed")
        }
    } else {
        return apiError(event, "You must be verified to add vehicles to this account.")
    }
})

const removeVehicle = async (vehicleID, groupID) => {
    // first, remove any org assignments to that vehicle
    const group = getGroup(groupID)
    await clearAssignments(vehicleID, group.org.id)
    const query = 
        `MATCH (a:Vehicle {id: $vehicleID})-[:ATTACHED_TO]->(g:VehicleGroup {id: $groupID})
         DETACH DELETE a`

    const params = {
        vehicleID: vehicleID,
        groupID: groupID
    }

    const { error } = await writeQuery(query, params)
    if (error) {
        return error
    } else {
        return null
    }
}