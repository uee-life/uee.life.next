import { manager } from '~/server/utils/auth0'

export default defineEventHandler(async (event) => {
    manager()
    //return await getStats()
})
/*
async function getStats() {
    const stats = {}
    stats.latestCitizen = await latestCitizen()
    return stats
}

async function latestCitizen() {
    var params = {
        page: 0,
        per_page: 1,
        fields: 'details.response.body.app_metadata',
        q: 'type:"sapi" AND description:"Update a user"'
    }

    const result = await manager.getLogs(params).then((res) => {
        return res
    }).catch((err) => {
        console.error(err)
    });

    latest = ""

    if(result.length) {
        data = result[0].details.response.body.app_metadata
        if(data.handle_verified && data.handle != 'Capn_Flint') {
            latest = data.handle
            saveStat("latestCitizen", latest)
        } else {
            latest = await loadStat("latestCitizen")
        }
    } else {
        latest = await loadStat("latestCitizen")
    }

    return latest
}*/