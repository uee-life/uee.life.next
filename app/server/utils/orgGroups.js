export const getOrgGroup = async (orgID, subgroups=true) => {
    const query =
        `MATCH (g:OrgGroup)-[:PART_OF]->{0,10}(f:OrgGroup)-[:BELONGS_TO]->(o:Organization)
         WHERE o.id =~ $id
         RETURN g as info,
                f as root,
                o as org,
                COLLECT {
                    MATCH (sg:OrgGroup)-[:PART_OF]->(g)
                    return sg.id
                } as groups`
    const { result } = await readQuery(query, {id: '(?i)'+orgID.toUpperCase()})

    if (result[0]) {
        const group = {
            org: result[0].org,
            admins: await getOrgMembers(orgID, 5), //await getGroupAdmins(identifier, result[0].org.id),
            root: result[0].root,
            info: result[0].info,
            cmdr: result[0].info.cmdr ? await getCitizen(result[0].info.cmdr) : ''
        }
        if(subgroups) {
            console.info('adding subgroups')
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