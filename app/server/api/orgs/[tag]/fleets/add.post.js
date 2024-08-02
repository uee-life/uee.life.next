export default defineAuthenticatedEventHandler(async (event) => {
    const user = await loadUser(event.context.user)
    const tag = getRouterParam(event, 'tag')
    const fleet = await readBody(event)

    if (user && user.verified) {
        const owners = await getOrgMembers(tag, 5)
        if(!!owners.find(item => item.handle === user.handle)) {
            console.log('is owner!')
            await addFleet(fleet, tag)
        } else {
            accessDenied(event)
        }
        /*const error = await addShipModel(ship, user.handle)
        if (error) {
            return apiError(event, `Something went wrong: ${error}`)
        } else {
            return apiSuccess("Ship Added!")
        }*/
    } else {
        return apiError(event, "You must be verified to add ships to this account.")
    }
})

const addFleet = async (fleet, tag) => {
    const query = `
        MATCH (o:Organization {tag: $tag})
        MERGE (g:VehicleGroup {name: $name})-[:BELONGS_TO]->(o)
        SET g = {
            name: $name,
            purpose: $purpose,
            cmdr: $cmdr
        }`

    const { error } = await writeQuery(query, {
        name: fleet.name,
        purpose: fleet.purpose,
        cmdr: fleet.cmdr,
        tag: tag
    })
    console.log(error)
    return error
}