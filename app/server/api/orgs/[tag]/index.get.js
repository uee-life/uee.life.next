import * as rsi from "../../../utils/rsi"

export default defineEventHandler(async (event) => {
    const tag = getRouterParam(event, 'tag')
    return apiSuccess(await rsi.fetchOrg(tag))
})

