import { generateCodes } from "~/server/utils/InviteCodes"
import { fetchCitizen } from "~/server/utils/rsi"

// Authenticated
// Authorized: Current user
export default defineAuthenticatedEventHandler(async (event) => {
    const user = await loadUser(event.context.user)
    const account = await getAccount(user.user_id)
    console.debug(user.handle)

    const ver_code = account.app_metadata.verificationCode
    if(!ver_code) {
        return apiError("This shouldn't happen (no verification code)")
    } else {
        console.log('verification code: ', ueelifeCode(ver_code))
    }
    // clear cache first
    await useStorage('cache').removeItem(`nitro:functions:rsi-fetchCitizen:${user.handle}.json`)
    const bio_code = await fetchCitizen(user.handle).then((citizen) => {
        const code = citizen.bio.match(/\[ueelife\:[A-Za-z0-9\-]+\]/i)
        console.debug(citizen.bio)
        console.debug('bio code: ' + code)
        if (code) {
            return code[0]
        } else {
            return null
        }
    }).catch((err) => {
        console.error(err)
        return ""
    })
    if(!bio_code) {
        return apiError("Verification code not found in citizen bio.")
    } else {
        console.debug('found in bio: ', bio_code)
    }
    if (ueelifeCode(ver_code) == bio_code) {
        console.debug(user.user_id, user.handle)
        const result = await verifyUser(user.user_id, user.handle)
        await generateCodes(5, 'buddy', user.handle)
        return apiSuccess(result)
    } else {
        return apiError("codes no matchy")
    }
})

const ueelifeCode = (verificationCode) => {
    return `[ueelife:${verificationCode}]`
}