
export const getActiveStatus = async (handle) => {

}

export const getStatus = async (handle) => {
    // load status from the graph
    // TODO: Do some kind of group by here to pull all status types mapped to the given citizen
    const query = `
        MATCH (c:Citizen {handle: $handle})
        MATCH (c)-[s:HAS_STATUS]->(:Status {type: $status})
        RETURN s.updated as updated`

    const { result } = await readQuery(query, { handle: handle, status: 'active' })

    if (result[0]) {
        const status = parseStatus(result[0].updated)
        return status
    } else {
        return {
            active: 'offline',
            last: ''
        }
    }

    return status
}

export const setStatus = async (handle, status) => {
    // status object:
    // - status: [offline/online]
    // - last_activity: "activity text"
    // - activity_time: <activity-datetime>

    console.log(`setting status for ${handle} - ${status}`)
    const query = `
        MATCH (c:Citizen {handle: $handle})
        MERGE (status:Status {type: $status})
        MERGE (c)-[s:HAS_STATUS]->(status)
        SET s.updated = datetime()
        `

    const { error } = await writeQuery(query, { handle: handle, status: status })
    if ( error ) {
        return error
    }
    
    return null
}

export const parseStatus = (updated) => {
    const status = {
        active: 'offline',
        last: ''
    }
    const last = new Date(updated)
    status.last = last
    const now = new Date()
    const elapsed = now - last

    if (elapsed > 1800000) {
        // if the status is older than 30 minutes, set the status to offline
        status.active = 'offline'
        // TODO: Should we delete the status relationship here? 
    } else if (elapsed > 300000) {
        // if the status is older than 5 minutes, but less than 30 minutes, mark the status as "idle"
        status.active = 'idle'
    } else {
        status.active = 'online'
    }
    return status
}