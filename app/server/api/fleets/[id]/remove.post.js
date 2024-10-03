// Authenticated
// Authorized: parent group admins
export default defineAuthenticatedEventHandler(async (event) => {
    const user = await loadUser(event.context.user)
    const groupID = getRouterParam(event, 'id')

    if (groupID) {
        const parentVG = await getParentGroup(groupID)
        if (user && user.verified && parentVG.admins.some(e => e.handle == user.handle)) {
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