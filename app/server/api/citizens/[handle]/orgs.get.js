import * as rsi from '~/server/utils/rsi'

// cache this later. Not using right now
export default defineEventHandler(async (event) => {
    const handle = getRouterParam(event, 'handle')

    return apiSuccess(await rsi.fetchOrgList(handle))
})