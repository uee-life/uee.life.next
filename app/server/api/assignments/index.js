import { getAssignment } from "~/server/utils/assignments"

export default defineAuthenticatedEventHandler(async (event) => {
    const user = await loadUser(event.context.user)

    const assignments = await getCitizenAssignments(user.handle)

    return apiSuccess(assignments)
})

const getCitizenAssignments = async (handle) => {
    const query = `
        MATCH (Citizen {handle: $handle})-[r:ASSIGNED_TO]->(a:Assignment)
        return a as assignment,
            r as role
    `

    const { result } = await readQuery(query, {
        handle: handle
    })

    const assignments = []

    for (const res of result) {
        console.log(res)
        assignments.push(await getAssignment(res.assignment.id))
    }

    return assignments
}