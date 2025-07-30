export const createGroup = async (parentID, group, type) => {
    const query = `
        MATCH (parent:Group {id: $pid})
        MERGE (g:Group {name: $name})
        MERGE (g)-[:PART_OF]->(parent)
        SET g = {
            id: toUpper(left(randomUUID(), 8)),
            type: $type,
            name: $name,
            purpose: $purpose,
            cmdr: $cmdr
        }
        RETURN g.id as groupID`
    
    const { result, error } = await writeQuery(query, {
        type: group.type,
        name: group.name,
        purpose: group.purpose,
        cmdr: group.cmdr,
        pid: parentID
    })

    if (error) {
        return null
    } else {
        return result[0].groupID
    }
}

export const getGroup = async (groupID) => {
    const query =
        `MATCH (g:Group)-[:PART_OF]->{0,10}(r:Group)-[:BELONGS_TO]->(o:Organization)
         WHERE g.id =~ $id
         RETURN g as info,
                r as root,
                o as org,
                COLLECT {
                    MATCH (sg:Group)-[:PART_OF]->(g)
                    return sg.id
                } as groups,
                COLLECT {
                    MATCH (c:Citizen)-[:ASSIGNED_TO]->(a:Assignment {type: 'Leadership'})-[:ATTACHED_TO]->(g) return c
                } as commanders`
    const { result } = await readQuery(query, {id: '(?i)'+groupID.toUpperCase()})

    if (result[0]) {
        console.log(result[0])
        const commanders = []
        for (const cmdr of result[0].commanders) {
            commanders.push(cmdr.properties)
        }
        const group = {
            org: result[0].org,
            admins: commanders.concat(await getOrgLeaders(result[0].org.id)), // await getGroupAdmins(identifier, result[0].org.id),
            root: result[0].root,
            info: result[0].info,
            leader: result[0].info.cmdr ? await getCitizen(result[0].info.cmdr) : ''
        }
        group.groups = []
        for (const grp of result[0].groups) {
            group.groups.push(await getOrgGroup(grp))
        }
        return group
    } else {
        // group not found
        return null
    }
}

export const removeGroup = async (id) => {
    console.log(`removing group ${id}`)
    const query = `
        MATCH (g:Group {id: $id})<-[:PART_OF]-{0,10}(cg:Group)
        OPTIONAL MATCH (cg)<-[:ATTACHED_TO]-(a:Assignment)
        DETACH DELETE g,cg,a
    `

    const {error} = await writeQuery(query, {
        id: id
    })
    if (error) {
        console.log(error)
        return error
    } else {
        return null
    }
}

export const getParentGroup = async (identifier) => {
    const query = `
        MATCH (g {id: $id})-[:PART_OF]->{0,1}(parent:Group)
        MATCH (parent)-[:PART_OF]->{0,10}(r:Group)-[:BELONGS_TO]->(o:Organization)
        RETURN parent as info,
            r as root,
            o as org,
            COLLECT {
                MATCH (c:Citizen)-[:ASSIGNED_TO]->(a:Assignment {type: 'Leadership'})-[:ATTACHED_TO]->(parent) return c
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
            root: result[0].root,
            info: result[0].info,
            leader: result[0].info.cmdr ? await getCitizen(result[0].info.cmdr) : ''
        }
        return group
    } else {
        return null
    }
}

export const getGroupLeaders = async (groupID) => {
    // returns all commanders from the selected group up to root group commander
    const query = `
        MATCH (v:Group {id: $id})-[:PART_OF]->{0,10}(g:Group)
        RETURN COLLECT {
            MATCH (c:Citizen)-[:ASSIGNED_TO]->(a:Assignment {type: 'Leadership'})-[:ATTACHED_TO]->(g) return c
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

export const assignGroupLeader = async (citizen, groupID, role = '') => {
    // get or create an assignment
    // add new commander
    const addQuery = `
        MATCH (g:Group {id: $id})
        MATCH (c:Citizen)
        WHERE c.id =~ $handle
        WITH c, g
        MERGE (c)-[:ASSIGNED_TO {role: $role, assigned: datetime()}]->(a:Assignment {type: 'Leadership'})-[:ATTACHED_TO]->(g)
        SET a = {
            id: toUpper(left(randomUUID(), 8)),
            type: 'Leadership',
            desription: 'Group Leadership',
            max_assigned: 1
        }
        WITH a, g
        MATCH (g)-[:BELONGS_TO | PART_OF]->{0,10}(o:Organization|Citizen)
        WITH a, o
        MERGE (a)-[:OWNED_BY]->(o)
    `

    const { error } = await writeQuery(addQuery, {
        id: groupID,
        handle: '(?i)'+citizen.handle,
        role: role
    })
    if (error) {
        return null
    } else {
        return citizen.handle
    }    
}

export const clearGroupLeaders = async (groupID) => {
    // clear old commander
    const removeQuery = `
        MATCH (a:Assignment {type: 'Leadership'})-[:ATTACHED_TO]->(:Group {id: $id})
        DETACH DELETE a
    `
    const { error } = await writeQuery(removeQuery, {
        id: groupID
    })
}

// decide if this is just taking the handle, or a full citizen entity
export const removeGroupLeader = async (groupID, leader) => {
    const query = `
        MATCH (c:Citizen)-[:ASSIGNED_TO]->(a:Assignment {type: 'Leadership'})-[:ATTACHED_TO]->(:Group {id: $id})
        WHERE c.id =~ $leader
        DETACH DELETE a
    `
    const { error } = await writeQuery(query, {
        id: groupID,
        leader: leader
    })
    
}