import { getOrgMembers } from "~/server/utils/orgs"
import * as rsi from "../../../utils/rsi"

// Public
export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    const query = await getQuery(event)

    const ueeMembers = await getOrgMembers(id)

    const rsiMembers = await rsi.fetchMembers(id, query["page"])

    rsiMembers.members = merge(rsiMembers.members, ueeMembers, (a, b) => a.handle == b.handle).sort((a, b) => b.rank - a.rank)

    return apiSuccess(rsiMembers)
})

const merge = (a, b, predicate) => {
    const c = [...a]
    b.forEach((bItem) => (c.some((cItem) => predicate(bItem, cItem)) ? null : c.push(bItem)))
    return c
}
