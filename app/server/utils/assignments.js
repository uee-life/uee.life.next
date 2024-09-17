
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

export const createAssignment = async (targetID, ownerID, name, description='', max_assignees='0') => {
    const query = `
        MATCH (owner {id: $ownerID})
        MATCH (target {id: $targetID})
        MERGE (owner)<-[:OWNED_BY]-(a:Assignment)-[:ATTACHED_TO]->(target)
        SET a = {
            id: left(randomUUID(), 8),
            name: $name,
            description: $description,
            max_assigned: $max
        }
        RETURN a as assignment
    `
    console.log("assigning", targetID, ownerID, name, description)

    const { result } = await writeQuery(query, {
        ownerID: ownerID,
        targetID: targetID,
        name: name,
        description: description,
        max: max_assignees
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

const getAssignmentMeta = async (assignee, assignment) => {
    const query = `
        MATCH (assignee:Citizen)-[r:ASSIGNED_TO]->(assignment)
        WHERE assignee.id =~ $assignee
        AND assignment.id =~ $assignment
        return r.role as role,
            r.joined as joined
    `
    const { result } = await readQuery(query, {
        assignee: assignee,
        assignment: assignment
    })

    if (result[0]) {
        return {
            role: result[0].role,
            joined: result[0].joined
        }
    } else {
        return {
            role: '',
            joined: ''
        }
    }
}

export const getAssignment = async (assignmentID) => {
    const query = `
        MATCH (owner)<-[:OWNED_BY]-(assignment:Assignment)-[:ATTACHED_TO]->(target)
        WHERE assignment.id =~ $assID
        return owner,
                labels(owner)[0] as owner_type,
                target, 
                labels(target)[0] as labels, 
                assignment,
                COLLECT {
                    MATCH (assignee)-[:ASSIGNED_TO]->(assignment)
                    return assignee.id as id
                } as assignees
    `

    const { result } = await readQuery(query, {
        assID: `(?i)${assignmentID}`
    })
    if(result[0]) {
        const assignees = []
        for (const member of result[0].assignees) {
            assignees.push({
                citizen: await getCitizen(member),
                ...await getAssignmentMeta(member, assignmentID)
            })
        }
        return {
            type: result[0].labels,
            owner: {
                type: result[0].owner_type,
                ...result[0].owner
            },
            target: result[0].target,
            assignees: assignees,
            ...result[0].assignment
        }
    }
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

// gets all assignments owned, or attached to, a given entity
export const getAssignments = async (targetID, ownerID) => {
    const query = `
        MATCH (owner {id: $ownerID})<-[:OWNED_BY]-(a:Assignment)-[:ATTACHED_TO]->(target)
        WHERE target.id =~ $targetID
        return a.id as assignment
    `
    const { result } = await readQuery(query, {
        ownerID: ownerID,
        targetID: `(?i)${targetID}`
    })
    const assignments = []
    for (const res of result) {
        console.log(res)
        assignments.push(await getAssignment(res.assignment))
    }
    return assignments
}

export const getAllAssignments = async (targetID) => {
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
        assignments.push(await getAssignment(res.assignment))
    }
    return assignments
}