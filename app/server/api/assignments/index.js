import { getAssignment } from "~/server/utils/assignments"

export default defineAuthenticatedEventHandler(async (event) => {
    const user = await loadUser(event.context.user)

    const assignments = await getCitizenAssignments(user.handle)

    return apiSuccess(assignments)
})

const getCitizenAssignments = async (handle) => {
    const query = `
        MATCH (c:Citizen)-[:ASSIGNED_TO]->(a:Assignment)
        WHERE c.id =~ $handle
        return a as assignment
    `

    const { result } = await readQuery(query, {
        handle: '(?i)' + handle
    })

    const assignments = []

    for (const res of result) {
        console.log(res)
        assignments.push(await getAssignment(res.assignment.id))
    }

    return assignments
}