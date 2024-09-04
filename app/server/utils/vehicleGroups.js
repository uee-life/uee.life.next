
export const getCommander = async (groupID) => {
    // returns just the specific groups commander
    return 'capn_flint'
}

export const getCmdrList = async (groupID) => {
    // returns all commanders from the selected group up to fleet commander
}

export const clearCommander = async (groupID) => {
    // clear old commander
    const removeQuery = `
        MATCH (:Citizen)-[c:COMMANDER_OF]->(:VehicleGroup {id: $id})
        DELETE c
    `
    const { error } = await writeQuery(removeQuery, {
        id: groupID
    })
}

export const addCommander = async (citizen, groupID) => {
    // add new commander
    const addQuery = `
        MATCH (g:VehicleGroup {id: $id})
        MATCH (c:Citizen {handle: $handle})
        MERGE (c)-[:COMMANDER_OF]->(g)
    `

    const { error } = await writeQuery(addQuery, {
        id: groupID,
        handle: citizen.handle
    })
    if (error) {
        return null
    } else {
        return citizen.handle
    }
}