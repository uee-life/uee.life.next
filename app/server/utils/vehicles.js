
export const getVehicle = async (identifier) => {
    // get ship instance
    const query =
        `MATCH (c:Citizen)<-[:OWNED_BY]-(s:Vehicle {id: $id})-[:INSTANCE_OF]->(m:VehicleModel)
         RETURN c as owner,
                s as vehicle,
                m as info`
    const { result } = await readQuery(query, {id: identifier})
    // TODO: Check this actually returns a ship, else return an empty result.

    if (result[0]) {
        const data = {
            owner: result[0].owner,
            ...result[0].info,
            ...result[0].vehicle
        }
        return data
    } else {
        return null
    }
}