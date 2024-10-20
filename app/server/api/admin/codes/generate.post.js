// Public
export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    if (body.org) {
        return apiSuccess(await generateOrgCode(body.org))
    } else {
        return apiSuccess(await generateCodes(body.count))
    }
})