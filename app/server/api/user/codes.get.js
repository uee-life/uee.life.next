// Authenticated
// Authorized: Current user
export default defineAuthenticatedEventHandler(async (event) => {
    const user = await loadUser(event.context.user)
    const codes = await getBuddyCodes(user.handle)
    console.log('getting codes for', user.handle)

    // do something
    return apiSuccess(codes)
})

const getBuddyCodes = async (handle) => {
    const query = `
        MATCH (c:InviteCode {type: 'buddy'})
        WHERE c.owner =~ $handle
        return c as code
    `

    const { result } = await readQuery(query, {
        handle: '(?i)' + handle
    })

    console.log(result)

    let codes = []
    for (const res of result) {
        codes.push(res.code)
    }

    if(codes.length < 5) {
        const citizen = await getCitizen(handle)
        if (citizen.verified) {
            codes = await generateCodes(5, 'buddy', handle)
        }
    }

    return codes
}
