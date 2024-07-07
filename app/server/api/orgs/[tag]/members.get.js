import * as rsi from "../../../utils/rsi"

export default defineEventHandler(async (event) => {
    const tag = getRouterParam(event, 'tag')
    const query = await getQuery(event)

    return apiSuccess(await rsi.fetchMembers(tag, query["page"]))
})
