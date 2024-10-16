export const verifiedCount = async () => {
    const query = `
        MATCH (c:Citizen {verified: true})
        RETURN count(c) as count`
    const { result } = await readQuery(query)
    return result[0]
}

export const shipCount = async () => {
    const query = `
        MATCH (s:Vehicle)
        RETURN count(s) as count`
    const { result } = await readQuery(query)
    return result[0]
}

export const fleetCount = async () => {
    const query = `
        MATCH (g:VehicleGroup)-[:BELONGS_TO]->(o:Organization)
        return count(g) as count`
    const {result } = await readQuery(query)
    return result[0]
}