import { fetchMembers } from "../../../helpers/rsi"

export default defineEventHandler(async (event) => {
    const tag = getRouterParam(event, 'tag')
    const query = await getQuery(event)
    console.log('fetching members')
    return await fetchMembers(tag, query["page"])
})
