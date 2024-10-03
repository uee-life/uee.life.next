// Authenticated
export default defineAuthenticatedEventHandler(async (event) => {
    const user = loadUser(event.context.user)
    //TODO: do an admin authorization check here
    if (await checkPermission(user, ['admin:all'])) {
        const keys = await useStorage('cache').getKeys()
        const shipStats = await getShipStats()
        const summary = {
            cache: {
                count: keys.length
            },
            ships: parseStats(shipStats)
        }
        return summary
    } else {
        return accessDenied(event)
    }
})

function parseStats(data) {
    const stats = {}
    for (const d of data) {
        stats[d.stats.label]  = d.stats.value
    }
    return stats
}