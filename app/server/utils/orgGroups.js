export const getOrgGroup = async (groupID) => {
    const query =
        `MATCH (g:Group)-[:PART_OF]->{0,10}(f:Group)-[:BELONGS_TO]->(o:Organization)
         WHERE g.id =~ $id
         RETURN g as info,
                f as root,
                o as org,
                COLLECT {
                    MATCH (sg:Group)-[:PART_OF]->(g)
                    return sg.id
                } as groups`
    const { result } = await readQuery(query, {id: '(?i)'+groupID.toUpperCase()})

    if (result[0]) {
        console.log(result[0])
        const group = {
            org: result[0].org,
            admins: await getOrgMembers(result[0].org.id, 5), //await getGroupAdmins(identifier, result[0].org.id),
            root: result[0].root,
            info: result[0].info,
            cmdr: result[0].info.cmdr ? await getCitizen(result[0].info.cmdr) : ''
        }
        console.info('adding subgroups')
        group.groups = []
        for (const grp of result[0].groups) {
            console.log('getting subgroup: ', grp)
            group.groups.push(await getOrgGroup(grp))
        }
        return group
    } else {
        // if create == true, create a fresh group for hte org here.
        return null
    }
}

export const getParentOrgGroup = async (identifier) => {
    const query = `
        MATCH (g {id: $id})-[:PART_OF]->{0,1}(parent:Group)
        MATCH (parent)-[:PART_OF]->{0,10}(f:Group)-[:BELONGS_TO]->(o:Organization)
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

export const getOrgChart = async (orgID, create=false) => {
    const query =
        `MATCH (g:Group {class: 'org'})-[:PART_OF]->{0,10}(f:Group {class: 'org'})-[:BELONGS_TO]->(o:Organization)
         WHERE o.id =~ $id
         RETURN g as info,
                f as root,
                o as org,
                COLLECT {
                    MATCH (sg:Group)-[:PART_OF]->(g)
                    return sg.id
                } as groups`
    const { result } = await readQuery(query, {id: '(?i)'+orgID.toUpperCase()})

    if (result[0]) {
        console.log(result[0])
        const group = {
            org: result[0].org,
            admins: await getOrgMembers(orgID, 5), //await getGroupAdmins(identifier, result[0].org.id),
            root: result[0].root,
            info: result[0].info,
            cmdr: result[0].info.cmdr ? await getCitizen(result[0].info.cmdr) : ''
        }
        console.info('adding subgroups')
        group.groups = []
        for (const grp of result[0].groups) {
            console.log('getting subgroup: ', grp)
            group.groups.push(await getOrgGroup(grp))
        }
        return group
    } else {
        // if create == true, create a fresh group for hte org here.
        return null
    }
}