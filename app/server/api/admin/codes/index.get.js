// Public
export default defineEventHandler(async (event) => {

    return apiSuccess(await getActiveCodes())
})

const getActiveCodes = async () => {
    const query = `
        MATCH (c:InviteCode)
        WHERE c.used = false
        RETURN c as code ORDER BY c.issued DESC
    `

    const { result } = await readQuery(query)

    const codes = {
        standard: [],
        org: [],
    }

    for (const res of result) {
        console.log(res)
        if (res.code.type == 'org') {
            codes.org.push(`${res.code.org}:${res.code.code}`)
        } else if (res.code.type == 'standard') {
            codes.standard.push(res.code)
        }
    }
    return codes
}