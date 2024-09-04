import { addCommander } from "~/server/utils/vehicleGroups"

export default defineAuthenticatedEventHandler(async (event) => {
    const user = await loadUser(event.context.user)
    const tag = getRouterParam(event, 'tag')
    const fleet = await readBody(event)

    if (user && user.verified) {
        const owners = await getOrgMembers(tag, 5)
        if(!!owners.find(item => item.handle === user.handle)) {
            console.log('is owner!')
            const fleetID = await addFleet(fleet, tag)
            if(fleet.cmdr) {
                addCommander(await getCitizen(fleet.cmdr, true), fleetID)
            }
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
    // this is wrong. Need to set cmdr to be an entity relationship CMDR_OF
    const query = `
        MATCH (o:Organization {tag: $tag})
        MERGE (g:VehicleGroup {name: $name})-[:BELONGS_TO]->(o)
        SET g = {
            id: left(randomUUID(), 8),
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
        tag: tag
    })
    if (error) {
        console.error(error)
    } else {
        return result[0]._fields[0]
    }
}