import { getParentGroup, getVehicleGroup } from "./vehicleGroups"
import { getVehicle } from "./vehicles"

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

// This is SLOW (3s)
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
        const assignment =  {
            class: result[0].labels,
            owner: {
                type: result[0].owner_type,
                ...result[0].owner
            },
            target: result[0].target,
            assignees: assignees,
            ...result[0].assignment
        }

        if (assignment.owner.type == 'Citizen') {
            assignment.admins = [assignment.owner]
            if (assignment.class == 'Vehicle') {
                assignment.target = await getVehicle(assignment.target.id)
            }
        } else if (assignment.owner.type == 'Organization') {
            if (assignment.class == 'Vehicle') {
                const parent = await getParentGroup(assignment.target.id)
                assignment.admins = parent.admins
                assignment.fleet = parent.fleet
                assignment.target = await getVehicle(assignment.target.id)
            }
            if (assignment.class == 'VehicleGroup') {
                const group = await getVehicleGroup(assignment.target.id)
                assignment.fleet = group.fleet
                assignment.admins = group.admins
            }
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