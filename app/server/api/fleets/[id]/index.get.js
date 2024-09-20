export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    const fleet = await getVehicleGroup(id)
    if (fleet) {
        return apiSuccess(fleet)
    } else {
        return apiError(event, 'Fleet not found')
    }
    
})

// not used currently
export const getSubGroups = async (identifier) => {
    // get ship instance
    const query =
        `MATCH (f:VehicleGroup)-[:BELONGS_TO]->(p:VehicleGroup {id: $id})
         RETURN f as info`
    const { result, error } = await readQuery(query, {id: identifier})
    // TODO: Check this actually returns a ship, else return an empty result.
    if (error) {
        return null
    } else {
        const groups = []
        for (const res of result) {
            groups.push(res.info.id)
        }
        return groups
    }
}