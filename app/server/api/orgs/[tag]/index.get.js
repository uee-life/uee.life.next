import * as rsi from "../../../utils/rsi"

export default defineEventHandler(async (event) => {
    const tag = getRouterParam(event, 'tag')
    return await rsi.fetchOrg(tag)
})

