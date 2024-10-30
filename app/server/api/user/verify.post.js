import { generateCodes } from "~/server/utils/InviteCodes"
import { fetchCitizen } from "~/server/utils/rsi"

// Authenticated
// Authorized: Current user
export default defineAuthenticatedEventHandler(async (event) => {
    const user = await loadUser(event.context.user)
    const account = await getAccount(user.user_id)

    const ver_code = account.app_metadata.verificationCode
    if(!ver_code) {
        return apiError("This shouldn't happen (no verification code)")
    } else {
        logger.debug('verification code: ', ueelifeCode(ver_code))
    }
    const bio_code = await fetchCitizen(user.handle).then((citizen) => {
        const code = citizen.bio.match(/\[ueelife\:[A-Za-z0-9\-]+\]/i)
        logger.debug(citizen.bio)
        logger.debug('bio code: ' + code)
        if (code) {
            return code[0]
        } else {
            return null
        }
    }).catch((err) => {
        logger.error(err)
        return ""
    })
    if(!bio_code) {
        return apiError("Verification code not found in citizen bio.")
    } else {
        logger.debug('found in bio: ', bio_code)
    }
    if (ueelifeCode(ver_code) == bio_code) {
        logger.debug(user.user_id, user.handle)
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