// Authenticated
// Authorized: Group admins
export default defineAuthenticatedEventHandler(async (event) => {
    const user = await loadUser(event.context.user)
    const data = await readBody(event)

    const group = await getGroup(data.groupID)

    if (user && user.verified && group.admins.some(e => e.handle == user.handle)) {
        const error = await assignMember(data.handle, group)
        if (error) {
            return apiError(event, `Something went wrong: ${error}`)
        } else {
            return apiSuccess("Vehicle Added!")
        }
    } else {
        return accessDenied(event)
    }
})

const assignMember = async (citizen, group, role = 'Member') => {
    // need to first add the vehicle to the vehicle group
    const query = `
        MATCH (g:Group {id: $groupID})
        MATCH (c:Citizen)
        WHERE c.id =~ $handle
        MERGE (c)-[:ASSIGNED_TO {role: $role, assigned: datetime()}]->(a:Assignment {type: 'Membership'})-[:ATTACHED_TO]->(g)
        SET a = {
            id: toUpper(left(randomUUID(), 8)),
            type: 'Membership',
            desription: 'Group Membership'
        }
        WITH a, g
        MATCH (g)-[:BELONGS_TO | PART_OF]->{0,10}(o:Organization|Citizen)
        WITH a, o
        MERGE (a)-[:OWNED_BY]->(o)
    `

    // then we need to create a new crew assignment for that vehicle, owned by the org

    const { result, error } = await writeQuery(query, {
        handle: citizen.toUpperCase(),
        groupID: group.info.id,
        role: role
    })

    return error
}