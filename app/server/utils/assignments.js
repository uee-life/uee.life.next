
export const checkAssignmentPerms = async (target, user, data=null) => {
    const assignment = await getAssignment(target)
    switch (assignment.owner.type) {
        case 'Citizen':
            if (data && data.handle == user.handle) {
                // can always remove yourself
            } else if (user.handle == assignment.owner.handle) {
                // authorized owner
                return true
            } else {
                // not authorized
                return false
            }
        case 'Organization':
            const orgMembers = await getOrgMembers(assignment.owner.id, 5)
            console.log("Org members:", orgMembers)
            // finish me
            return false
        default:
            console.warn('Unrecognized assignment owner type:', assignment.owner.type)
            return false
    }
}

export const createAssignment = async (targetID, ownerID, type, max='0') => {
    const query = `
        MATCH (owner)
        WHERE owner.id =~ $ownerID
        MATCH (target {id: $targetID})
        MERGE (owner)<-[:OWNED_BY]-(a:Assignment)-[:ATTACHED_TO]->(target)
        SET a = {
            id: toUpper(left(randomUUID(), 8)),
            type: $type,
            max_assigned: $max
        }
        RETURN a as assignment
    `
    console.log("assigning", targetID, ownerID, type, max)

    const { result } = await writeQuery(query, {
        ownerID: '(?i)' + ownerID,
        targetID: targetID,
        type: type,
        max: max
    })

    return result.assignment
}

export const removeAssignment = async (assignmentID, ownerID) => {
    const query = `
        MATCH (a:Assignment)-[:OWNED_BY]->(owner)
        WHERE a.id =~ $assignmentID
        AND owner.id =~ $ownerID
        DETACH DELETE a
    `
    const { error } = await writeQuery(query, {
        assignmentID: assignmentID,
        ownerID: ownerID
    })

    return error
}

//TODO: Merge this query
const getAssignmentMeta = async (assignee, assignment) => {
    const query = `
        MATCH (assignee:Citizen)-[r:ASSIGNED_TO]->(assignment)
        WHERE assignee.id =~ $assignee
        AND assignment.id =~ $assignment
        return r.role as role,
            r.assigned as assigned
    `
    const { result } = await readQuery(query, {
        assignee: '(?i)'+assignee,
        assignment: '(?i)'+assignment
    })

    if (result[0]) {
        return {
            role: result[0].role,
            assigned: result[0].assigned
        }
    } else {
        return {
            role: '',
            assigned: ''
        }
    }
}

export const getAssignment = async (assignmentID) => {
    return await getLegacyAssignment(assignmentID)
}

const fixAssignment = async (assignmentID) => {
    /**
     * Steps to fix:
     * 1 - (a)-attached_to->(t) becomes (t)-assigned_to->(a)
     * 2a - if owner (o) is an org:
     *    (a)-attached_to->(t)-part_of->(g) becomes (t)-assigned_to->(a)-attached_to->(g)
     * 2b - if owner (o) is a citizen:
     *    (a)-attached_to->(t) becomes (t)-assigned_to->(a)
     * 3 - owned_by relationships removed
     * 4 - (a:Crew) becomes (a:Vehicle)
     * 
     */
}

// This is SLOW (3s)
export const getLegacyAssignment = async (assignmentID) => {
    console.log('calling getAssignment for:', assignmentID)
    const query = `
        MATCH (owner)<-[:OWNED_BY]-(assignment:Assignment)-[:ATTACHED_TO]->(target)
        WHERE assignment.id =~ $assID
        return owner,
                labels(owner)[0] as owner_type,
                target,
                labels(target)[0] as labels,
                assignment,
                COLLECT {
                    MATCH (:Status {type: 'active'})<-[s:HAS_STATUS]-(assignee)-[r:ASSIGNED_TO]->(assignment)
                    WITH {
                        citizen: properties(assignee),
                        role: r.role,
                        assigned: r.assigned,
                        seen: s.updated
                        } as assig
                    return assig
                } as assignees
    `

    const { result } = await readQuery(query, {
        assID: `(?i)${assignmentID}`
    })
    if(result[0]) {
        const assignees = []
        for (const member of result[0].assignees) {
            member.citizen.status = await parseStatus(member.seen)
            delete member.seen
            assignees.push(member)
        }
        const assignment =  {
            class: result[0].assignment.type, // remove this later
            owner: {
                type: result[0].owner_type,
                ...result[0].owner
            },
            target: result[0].target,
            assignees: assignees,
            ...result[0].assignment
        }

        switch (assignment.owner.type) {
            case 'Citizen':
                console.log('Citizen Assignment')
                assignment.admins = [assignment.owner]
                switch (assignment.class) {
                    case 'Vehicle':
                        // vehicle crew
                        //assignment.target = assignment.target.id
                        console.log(assignment.type)
                        break
                    default:
                        // assignment class not supported
                }
                break

            case 'Organization':
                console.log('Org Assignment', assignment.type)
                switch (assignment.type) {
                    case 'Crew':
                        // Crew assignment to a ship in an org vehicle group

                    case 'Vehicle':
                        const parent = await getParentGroup(assignment.target.id)
                        assignment.group = parent.root
                        assignment.admins = parent.admins
                        //assignment.target = assignment.target.id
                        break
                    case 'VehicleGroup':
                        const group = await getGroup(assignment.target.id)
                        assignment.group = group.root
                        assignment.admins = group.admins
                        //assignment.target = assignment.target.id
                        break
                    case 'OrgGroup':
                        // Group member
                        break
                    case 'Job':
                        // Job assignment
                        break
                }
                break

            default:
                console.log('unsupported: ', assignment.owner.type)
        }

        return assignment
    } else {
        return null
    }
}

export const getAssignmentAdmins = async (assignmentID) => {

}

export const clearAssignments = async (targetID, ownerID) => {
    const query = `
        MATCH (owner {id: $ownerID})<-[:OWNED_BY]-(a:Assignment)-[:ATTACHED_TO]->(target)
        WHERE target.id =~ $targetID
        DETACH DELETE a
    `
    const { error } = await writeQuery(query, {
        ownerID: ownerID,
        targetID: `(?i)${targetID}`
    })
}

export const clearAllAssignments = async (targetID) => {
    const query = `
        MATCH (a:Assignment)-[:ATTACHED_TO]->(target)
        WHERE target.id =~ $targetID
        DETACH DELETE a
    `
    const { error } = await writeQuery(query, {
        targetID: `(?i)${targetID}`
    })
}

// gets all assignments owned by a given owner and attached to a given entity
export const getAssignments = async (targetID) => {
    const query = `
        MATCH (target)-[:ASSIGNED_TO]->(a:Assignment)
        
        WHERE target.id =~ $targetID
        return a.id as assignment
    `
    const { result } = await readQuery(query, {
        ownerID: ownerID,
        targetID: `(?i)${targetID}`
    })
    let assignments = []
    for (const res of result) {
        assignments.push(await getAssignment(res.assignment))
    }
    if (assignments.length == 0) {
        assignments = await getLegacyAssignments(targetID)
    }
    return assignments
}

export const getLegacyAssignments = async (targetID) => {
    console.log('calling getLegacyAssignments for:', targetID)
    const query = `
        MATCH (a:Assignment)-[:ATTACHED_TO]->(target)
        WHERE target.id =~ $targetID
        return a.id as assignment
    `
    const { result } = await readQuery(query, {
        targetID: `(?i)${targetID}`
    })
    const assignments = []
    for (const res of result) {
        console.log(res)
        assignments.push(await getAssignment(res.assignment))
    }
    return assignments
}