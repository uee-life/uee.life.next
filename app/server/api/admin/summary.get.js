export default defineEventHandler(async (event) => {
    //TODO: do an admin authorization check here
    const keys = await useStorage('cache').getKeys()
    const shipStats = await getShipStats()
    const summary = {
        cache: {
            count: keys.length
        },
        ships: parseStats(shipStats)
    }
    return summary
})

function parseStats(data) {
    const stats = {}
    for (const d of data) {
        stats[d.stats.label]  = d.stats.value
    }
    return stats
}