export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')

    return apiSuccess(await getAssignment(id))
})

const getAssignment2 = async (id) => {
    const query = `
        MATCH (a:Assignment)-[:ATTACHED_TO]->(parent)
        WHERE a.id =~ $id
        MATCH (s:Vehicle)-[:ASSIGNED_TO]->(a)
        MATCH (o:Citizen)<-[:OWNED_BY]-(s)
        MATCH (s)-[:INSTANCE_OF]->(m:VehicleModel)
        RETURN a as assignment,
                parent.id as parent,
                labels(parent) as type,
                s as vehicle,
                m as vehicleData,
                o as owner`

    const { result } = await readQuery(query, {
        id: `(?i)${id}`
    })

    const assignments = []
    for (const res of result) {
        const ass = {
            type: res.type,
            parent: res.parent,
            ...res.assignment,
            //fleet: await getGroupFleet(res.group.id),
            //group: res.group,
            vehicle: {
                owner: res.owner,
                ...res.vehicleData,
                ...res.vehicle
            },
            assigned: await getAssignedCitizens(res.assignment.id)
        }
        if (ass.type == 'VehicleGroup') { // fleet assignment
            ass.fleet = await getGroupFleet(ass.parent)
        } else if (ass.type == 'Vehicle') { // crew assignment
            
        }
        assignments.push(ass)
    }
    return assignments[0]
}

const getGroupFleet = async (id) => {
    console.log('getGroupFleet', id)
    const query = `
        MATCH (g:VehicleGroup {id: $id})-[:BELONGS_TO]->{0,10}(f:VehicleGroup)-[:BELONGS_TO]->(o:Organization)
        return f as fleet,
                o as org`

        const { result } = await readQuery(query, {
            id: id
        })
        if (result) {
            const fleet = {
                org: result[0].org,
                info: result[0].fleet
            }
            return fleet
        }
        return {}
}

const getAssignedCitizens = async (id) => {
    console.log('getAssignedCitizens', id)
    const query = `
        MATCH (c:Citizen)-[:ASSIGNED_TO]->(a:Assignment {id: $id})
        return c as citizen`

    const { result } = await readQuery(query, {
        id: id
    })

    const citizens = []
    for (res of result) {
        console.log(res)
    }
    return citizens
}