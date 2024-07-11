

export const getStatus = (user) => {
    // load status from the graph

    // if the status is older than 5 minutes, but less than 30 minutes, mark the status as "away"

    // if the status is older than 30 minutes, set the status to offline
}

export const setStatus = (user, status) => {
    // status object:
    // - status: [offline/online]
    // - last_activity: "activity text"
    // - activity_time: <activity-datetime>
    
}