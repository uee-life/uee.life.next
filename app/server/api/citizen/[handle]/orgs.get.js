import * as rsi from '~/server/utils/rsi'

export default defineEventHandler(async (event) => {
    const handle = getRouterParam(event, 'handle')

    return await rsi.fetchOrgList(handle)
})