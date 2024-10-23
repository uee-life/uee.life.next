// Public
export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    if (body.org && body.org.length > 0) {
        return apiSuccess(await generateOrgCode(body.org))
    } else {
        return apiSuccess(await generateCodes(body.count))
    }
})