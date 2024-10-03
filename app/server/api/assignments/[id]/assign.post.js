import { checkAssignmentPerms, getAssignment } from "~/server/utils/assignments"

// Authenticated
// Authorized: verified assignment owner
export default defineAuthenticatedEventHandler(async (event) => {
    const user = await loadUser(event.context.user)
    const data = await readBody(event)
    const target = getRouterParam(event, 'id')

    if (user && user.verified) {
        if (checkAssignmentPerms(target, user, data)) {
            await assignCitizen(data, target)
        } else {
            return accessDenied(event)
        }
    } else {
        return apiError(event, "You must be verified to add ships to this account.")
    }
})

const assignCitizen = async (data, target) => {
    const query = `
        MATCH (c:Citizen)
        WHERE c.id =~ $handle
        MATCH (a:Assignment)
        WHERE a.id =~ $target
        MERGE (c)-[r:ASSIGNED_TO {role: $role, assigned: datetime()}]->(a)
    `

    const { error } = await writeQuery(query, {
        handle: data.handle,
        role: data.role,
        target: target
    })

    return error
}