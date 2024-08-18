

export const getFleet = async (identifier) => {
    // get ship instance
    const query =
        `MATCH (f:VehicleGroup {id: $id})-[:BELONGS_TO]->(o:Organization)
         RETURN f as info,
                o as org`
    const { result } = await readQuery(query, {id: identifier})
    // TODO: Check this actually returns a ship, else return an empty result.

    if (result[0]) {
        const fleet = {
            org: result[0].org,
            info: result[0].info,
            cmdr: await getCitizen(result[0].info.cmdr)
            //...result[0].info
        }
        return fleet
    } else {
        return null
    }
}