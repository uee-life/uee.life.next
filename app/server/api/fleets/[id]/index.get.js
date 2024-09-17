import { getFleetGroups } from "./groups.get"

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    const fleet = await getGroup(id)
    if (fleet) {
        return apiSuccess(fleet)
    } else {
        return apiError(event, 'Fleet not found')
    }
    
})

export const getGroup = async (identifier) => {
    const query =
        `MATCH (g:VehicleGroup {id: $id})-[:BELONGS_TO]->{0,10}(f:VehicleGroup)-[:BELONGS_TO]->(o:Organization)
         RETURN g as info,
                f as fleet,
                o as org,
                COLLECT {
                    MATCH (sg:VehicleGroup)-[:BELONGS_TO]->(g)
                    return sg.id
                } as groups`
    const { result } = await readQuery(query, {id: identifier})

    if (result[0]) {
        const fleet = {
            org: result[0].org,
            admins: await getOrgMembers(result[0].org.id, 5),
            fleet: result[0].fleet,
            info: result[0].info,
            cmdr: result[0].info.cmdr ? await getCitizen(result[0].info.cmdr) : '',
            groups: []
        }
        for (const group of result[0].groups) {
            fleet.groups.push(await getGroup(group))
        }
        return fleet
    } else {
        return null
    }
}

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