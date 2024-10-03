import * as rsi from "../../../utils/rsi"

// Public
export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    const query = await getQuery(event)

    return apiSuccess(await rsi.fetchMembers(id, query["page"], false))
})
