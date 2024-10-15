
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

export const getVehicleModel = async (id) => {
    const query = `
        MATCH (v:VehicleModel)-[:MADE_BY]->(o:Organization)
        WHERE v.id = $id
        RETURN v as model,
                o as manufacturer
    `

    const { result } = await readQuery(query, {
        id: id
    })

    if(result[0]) {
        const data = {
            model: result[0].model,
            manufacturer: result[0].manufacturer
        }
        return data
    } else {
        return null
    }
}