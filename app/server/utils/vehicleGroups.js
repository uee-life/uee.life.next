
export const getVehicleGroup = async (identifier, subgroups=true) => {
    const query =
        `MATCH (g:VehicleGroup)-[:PART_OF]->{0,10}(f:VehicleGroup)-[:BELONGS_TO]->(o:Organization)
         WHERE g.id =~ $id
         RETURN g as info,
                f as fleet,
                o as org,
                COLLECT {
                    MATCH (sg:VehicleGroup)-[:PART_OF]->(g)
                    return sg.id
                } as groups`
    const { result } = await readQuery(query, {id: '(?i)'+identifier.toUpperCase()})

    if (result[0]) {
        const group = {
            org: result[0].org,
            admins: await getGroupAdmins(identifier, result[0].org.id),
            fleet: result[0].fleet,
            info: result[0].info,
            cmdr: result[0].info.cmdr ? await getCitizen(result[0].info.cmdr) : ''
        }
        if(subgroups) {
            logger.info('adding subgroups')
            group.groups = []
            for (const grp of result[0].groups) {
                group.groups.push(await getVehicleGroup(grp))
            }
        }  
        return group
    } else {
        return null
    }
}


export const getParentGroup = async (identifier) => {
    const query = `
        MATCH (g {id: $id})-[:PART_OF]->{0,1}(parent:VehicleGroup)
        MATCH (parent)-[:PART_OF]->{0,10}(f:VehicleGroup)-[:BELONGS_TO]->(o:Organization)
        RETURN parent as info,
            f as fleet,
            o as org,
            COLLECT {
                MATCH (c:Citizen)-[:ASSIGNED_TO]->(a:Assignment {type: 'Leader'})-[:ATTACHED_TO]->(parent) return c
            } as commanders`

    const { result } = await readQuery(query, {id: identifier})

    if (result[0]) {
        const commanders = []
        for (const cmdr of result[0].commanders) {
            commanders.push(cmdr.properties)
        }
        const group = {
            org: result[0].org,
            admins: commanders.concat(await getOrgMembers(result[0].org.id, 5)),
            fleet: result[0].fleet,
            info: result[0].info
        }
        return group
    } else {
        return null
    }
}

const getGroupAdmins = async (groupID, orgID) => {
    let admins = []
    admins = admins.concat(await getOrgMembers(orgID, 5))
    admins = admins.concat(await getCmdrList(groupID))
    return admins
}

export const getCmdrList = async (groupID) => {
    // returns all commanders from the selected group up to fleet commander
    const query = `
        MATCH (v:VehicleGroup {id: $id})-[:PART_OF]->{0,10}(g:VehicleGroup)
        RETURN COLLECT {
            MATCH (c:Citizen)-[:ASSIGNED_TO]->(a:Assignment {type: 'Leader'})-[:ATTACHED_TO]->(g) return c
        } as commanders
    `

    const { result, error } = await readQuery(query, {
        id: groupID
    })
    const commanders = []
    for (const res of result) {
        for (const cmdr of res.commanders) {
            commanders.push(cmdr.properties)
        }
        
    }    
    return commanders
}

export const clearCommander = async (groupID) => {
    // clear old commander
    const removeQuery = `
        MATCH (a:Assignment {type: 'Leader'})-[:ATTACHED_TO]->(:VehicleGroup {id: $id})
        DETACH DELETE a
    `
    const { error } = await writeQuery(removeQuery, {
        id: groupID
    })
}

export const addCommander = async (citizen, groupID) => {
    // get or create an assignment
    // add new commander
    const addQuery = `
        MATCH (g:VehicleGroup {id: $id})
        MATCH (c:Citizen)
        WHERE c.id =~ $handle
        WITH c, g
        MERGE (c)-[:ASSIGNED_TO {role: 'Commander', assigned: datetime()}]->(a:Assignment)-[:ATTACHED_TO]->(g)
        SET a = {
            id: toUpper(left(randomUUID(), 8)),
            type: 'Leader',
            desription: 'Group Leadership',
            max_assigned: 1
        }
        WITH a, g
        MATCH (g)-[:BELONGS_TO | PART_OF]->{0,10}(o:Organization)
        WITH a, o
        MERGE (a)-[:OWNED_BY]->(o)
    `

    const { error } = await writeQuery(addQuery, {
        id: groupID,
        handle: '(?i)'+citizen.handle
    })
    if (error) {
        return null
    } else {
        return citizen.handle
    }
}