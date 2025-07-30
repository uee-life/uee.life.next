// Authenticated
// Authorized: Org Owners (rank 5)
export default defineAuthenticatedEventHandler(async (event) => {
    const user = await loadUser(event.context.user)
    const orgID = getRouterParam(event, 'id')
    const fleet = await readBody(event)
    console.log(fleet)

    if (fleet && user && user.verified) {
        // limit to only org leaders
        const owners = await getOrgLeaders(orgID)

        if(owners.some(item => item.handle === user.handle)) {
            const fleetID = await addFleet(fleet, orgID)
            if(fleetID && fleet.leader) {
                assignGroupLeader(await getCitizen(fleet.leader, true), fleetID, 'Commander')
            } else {
                console.error(`Could not create new fleet`)
                return apiError(event, `Could not create new fleet`, 400)
            }
        } else {
            accessDenied(event)
        }
    } else {
        return apiError(event, "You must be verified to add ships to this account.", 401)
    }
})

const addFleet = async (fleet, orgID) => {
    const query = `
        MATCH (o:Organization {id: $orgID})
        MERGE (g:Group {name: $name, type: 'vehicle'})-[:BELONGS_TO]->(o)
        SET g = {
            id: toUpper(left(randomUUID(), 8)),
            type: 'vehicle',
            name: $name,
            purpose: $purpose
        }
        RETURN g.id as identifier
    `

    const { result, error } = await writeQuery(query, {
        name: fleet.name,
        purpose: fleet.purpose,
        orgID: orgID
    })
    if (error) {
        console.error(error)
        return 0
    } else {
        return result[0].identifier
    }
}