import * as rsi from "../../../utils/rsi"

// Public
export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    return apiSuccess(await rsi.fetchOrg(id))
})

