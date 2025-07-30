// Public
export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    const group = await getOrgGroup(id)
    const members = await getGroupMembers(id, group.org.id)
    if (members) {
        return apiSuccess(members)
    } else {
        return apiError(event, 'No Members Found')
    }
    
})

const getGroupMembers = (id, orgID) => {
    return getAssignments(id, orgID)
}