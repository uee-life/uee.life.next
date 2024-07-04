import * as rsi from "../../../utils/rsi"

export default defineEventHandler(async (event) => {
    const tag = getRouterParam(event, 'tag')
    const query = await getQuery(event)
    console.log('fetching affiliates')
    return await rsi.fetchMembers(tag, query["page"], false)
})
