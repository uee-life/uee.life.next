import { getParentGroup } from "~/server/utils/vehicleGroups"

export default defineAuthenticatedEventHandler(async (event) => {
    const user = await loadUser(event.context.user)
    const groupID = getRouterParam(event, 'id')

    // TODO: add a check here to authorize deletion of the subgroup 
    // (parent cmdr, or org director)

    // get citizen info, and create the entity if it doesn't exist yet
    if (groupID) {
        const parentVG = await getParentGroup(groupID)
        if (parentVG.admins.some(e => e.handle == user.handle)) {
            const error = await removeGroup(groupID)
            if (error) {
                return apiError(`Couldn't remove group`, 400)
            } else {
                return apiSuccess('Group removed')
            }
        } else {
            return accessDenied(event)
        }
        
    } else {
        return apiError(event, 400)
    }
    
})

const removeGroup = async (id) => {
    const query = `
        MATCH (g:VehicleGroup {id: $id})<-[:BELONGS_TO]-{0,10}(cg:VehicleGroup)
        OPTIONAL MATCH (cg)<-[:ATTACHED_TO]-(a:Assignment)
        DETACH DELETE g,cg,a
    `

    const {error} = await writeQuery(query, {
        id: id
    })
    if (error) {
        console.log(error)
        return error
    } else {
        return null
    }
}