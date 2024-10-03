// Public
export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    const groups = await getFleetGroups(id)
    console.log(groups)
    if (groups != null) {
        return apiSuccess(groups)
    } else {
        return apiError(event, 'Fleet not found')
    }
    
})

export const getFleetGroups = async (identifier) => {
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
            const group = {
                info: res.info,
                cmdr: res.info.cmdr ? await getCitizen(res.info.cmdr) : {}
            }
            groups.push(group)
        }
        return groups
    }
}