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
        buddy: []
    }

    for (const res of result) {
        if (res.code.type == 'org') {
            codes.org.push(`${res.code.org}:${res.code.code}`)
        } else if (res.code.type == 'standard') {
            codes.standard.push(res.code)
        } else if (res.code.type == 'buddy') {
            codes.buddy.push(res.code)
        }
    }
    return codes
}