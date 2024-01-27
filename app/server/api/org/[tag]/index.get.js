import { fetchOrg } from "../../../helpers/rsi"

export default defineEventHandler(async (event) => {
    const tag = getRouterParam(event, 'tag')
    return await fetchOrg(tag)
})

