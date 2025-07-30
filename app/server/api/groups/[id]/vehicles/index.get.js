// Public
export default defineEventHandler(async (event) => {
    const groupID = getRouterParam(event, 'id')

    return apiSuccess(await perfMon(getVehicleList, groupID))
})

/**
 * As we migrate from the legacy direct relationships for vehicles in groups to the assignments system,
 * we need to account for pre-existing legacy relationships. To do so we follow the following process whenever a group is loaded:
 * 1 - Check for any vehicles *assigned* to the group (using an assignment node). Return if found.
 * 2 - If none found, run a legacy check for vehicles directly connected to the group.
 * 3a - If found, create a new assignment for that vehicle to the group, and remove the old relationship
 * 3b - If not found, there's just no vehicles, so return an empty list
 */
const getVehicleList = async (id) => {
    var vehicles = []
    console.log('Getting vehicle list')

    const query = `
        MATCH (g:Group)
        WHERE g.id =~ $groupID
        MERGE (a:Assignment {type: 'Vehicle'})-[:ATTACHED_TO]->(g)
        WITH a, g
        MATCH (v:Vehicle)-[:ASSIGNED_TO]->(a)
        MATCH (v)-[:INSTANCE_OF]->(m:VehicleModel)
        MATCH (v)-[:OWNED_BY]->(o:Citizen)
        RETURN v as vehicle,
                m as vehicleData,
                o as owner,
                g as group,
                a as assignment,
                COLLECT {
                    MATCH (:Status {type: 'active'})<-[s:HAS_STATUS]-(assignee:Citizen)-[r:ASSIGNED_TO]->(a)
                    WITH {
                        citizen: properties(assignee), 
                        role:r.role, 
                        assigned: r.assigned, 
                        seen: s.updated
                        } as assig
                    return assig
                } as assignees
    `

    const { result } = await readQuery(query, { groupID: id })
    if (result.length > 0) {
        for (const res of result) {
            const assignees = []
            for (const member of result[0].assignees) {
                member.citizen.status = parseStatus(member.seen)
                assignees.push(member)
            }
            if (assignees) {
                const vehicle = {
                    owner: res.owner,
                    crew: assignees,
                    ...res.vehicleData,
                    ...res.vehicle
                }
                vehicles.push(vehicle)
            } else {
                console.log('Legacy Needed')
            }
        }
    } else {
        vehicles = await getLegacyVehicleList(id)
    }
    return vehicles
}

//TODO: Optimize this (too many DB calls)
const getLegacyVehicleList = async (id) => {
    console.log('getLegacyVehicleList')
    const vehicles = []

    // Legacy query
    const query =
        `MATCH (g:Group)-[:PART_OF]->{0,10}(Group)-[:BELONGS_TO]->(owner)
        WHERE g.id =~ $groupID
        MATCH (v:Vehicle)-[:PART_OF]->(g)
        MATCH (owner)<-[:OWNED_BY]-(a:Assignment)-[:ATTACHED_TO]->(v)
        MATCH (v)-[:INSTANCE_OF]->(m:VehicleModel)
        MATCH (v)-[:OWNED_BY]->(o:Citizen)
        RETURN v as vehicle,
                m as vehicleData,
                o as owner,
                g as group,
                a as assignment,
                COLLECT {
                    MATCH (:Status {type: 'active'})<-[s:HAS_STATUS]-(assignee:Citizen)-[r:ASSIGNED_TO]->(a)
                    WITH {
                        citizen: properties(assignee), 
                        role:r.role, 
                        assigned: r.assigned, 
                        seen: s.updated
                        } as assig
                    return assig
                } as assignees`

    const { result } = await readQuery(query, {groupID: "(?i)"+id})
    for (const res of result) {
        updateRelationships(res)
        const assignees = []
        for (const member of res.assignees) {
            console.log(member)
            member.citizen.status = parseStatus(member.seen)
            assignees.push(member)
        }
        const vehicle = {
            owner: res.owner,
            crew: assignees,
            assignment: res.assignment,
            ...res.vehicleData,
            ...res.vehicle
        }

        vehicles.push(vehicle)
    }
    
    return vehicles
}

const updateRelationships = async (result) => {
    const query = `
        MATCH (v:Vehicle)-[:ASSIGNED_TO]->(a:Assignment {type: 'Group'})-[:ATTACHED_TO]->(g:Group)
        WHERE g.id =~ $group AND v.id =~ $vehicle
        return a as assignment
    `

    //const { result, error } = await readQuery(query, {group: group, vehicle: vehicle})
    console.log('RESULT', result)
}