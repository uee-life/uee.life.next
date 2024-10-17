// Public
export default defineEventHandler(async (event) => {

    return apiSuccess(await getActiveCodes())
})

const getActiveCodes = async () => {
    const query = `
        MATCH (c:InviteCode)
        WHERE c.used = false
        RETURN c.code as code
    `

    const { result } = await readQuery(query)
    return result
}