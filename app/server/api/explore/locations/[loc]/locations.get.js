import { readQuery, writeQuery } from "~/server/utils/neo4j"

export default defineEventHandler(async (event) => {
    const code = getRouterParam(event, 'loc')
    const orbitalQuery = "MATCH (loc:Location&(PLANET|MOON))-[:ORBITS]->{1,3}(s:Location {code: $code}) return loc"
    const poiQuery = "MATCH (loc:Location&POI)-[:ORBITS]->{1,3}(s:Location {code: $code}) return loc"

    const { result: orbitals, error: orbitalError } =  await readQuery(orbitalQuery, { code: code.toUpperCase() })
    const { result: pois, error: poiError} = await readQuery(poiQuery, { code: code.toUpperCase() })
    const locations = {
        orbitals: [],
        pois: []
    }
    orbitals.forEach(record => {
        locations.orbitals.push(record.loc)
    })
    pois.forEach(record => {
        locations.pois.push(record.loc)
    })
    return apiSuccess(locations)
})
