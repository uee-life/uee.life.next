// Public
export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    const members = await getGroupMembers(id)
    if (members) {
        return apiSuccess(members)
    } else {
        return apiError(event, 'Group not found')
    }
    
})

const getGroupMembers = (id) => {
    return {}
}