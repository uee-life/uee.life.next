import * as rsi from "../../../utils/rsi"

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    return apiSuccess(await rsi.fetchOrg(id))
})

