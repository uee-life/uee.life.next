// Authenticated
// Authorized: Org Owners (rank 5)
export default defineAuthenticatedEventHandler(async (event) => {
    const user = await loadUser(event.context.user)
    const id = getRouterParam(event, 'id')
    const fleet = await readBody(event)

    if (user && user.verified) {
        const owners = await getOrgMembers(id, 5)
        if(owners.some(item => item.handle === user.handle)) {
            const fleetID = await addFleet(fleet, id)
            if(fleet.cmdr) {
                addCommander(await getCitizen(fleet.cmdr, true), fleetID)
            }
        } else {
            accessDenied(event)
        }
    } else {
        return apiError(event, "You must be verified to add ships to this account.")
    }
})

const addFleet = async (fleet, orgID) => {
    // this is wrong. Need to set cmdr to be an entity relationship CMDR_OF
    const query = `
        MATCH (o:Organization {id: $orgID})
        MERGE (g:VehicleGroup {name: $name})-[:BELONGS_TO]->(o)
        SET g = {
            id: toUpper(left(randomUUID(), 8)),
            name: $name,
            purpose: $purpose,
            cmdr: $cmdr
        }
        RETURN g.id as identifier
    `

    const { result, error } = await writeQuery(query, {
        name: fleet.name,
        purpose: fleet.purpose,
        cmdr: fleet.cmdr,
        orgID: orgID
    })
    if (error) {
        console.error(error)
    } else {
        return result[0].identifier
    }
}