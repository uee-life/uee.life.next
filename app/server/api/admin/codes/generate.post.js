// Public
export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    return apiSuccess(await generateCodes(body.count))
})

const generateCodes = async (count) => {
    const query = `
        UNWIND range(1, $count) as row
        MERGE (c:InviteCode {code: toUpper(right(left(randomUUID(), 13), 9)), used: false})
        return c as code
    `
    const result = await writeQuery(query, {
        count: parseInt(count)
    })

    return result
}