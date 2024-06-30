import { fetchCitizen } from "~/server/utils/rsi"

export default defineAuthenticatedEventHandler(async (event) => {
    const user = await loadUser(event.context.user)
    const account = await getAccount(user.user_id)
    console.log(account)
    const ver_code = account.app_metadata.verificationCode
    if(!ver_code) {
        return apiError("This shouldn't happen (no verification code)")
    } else {
        console.log('verification code: ', ueelifeCode(ver_code))
    }
    const bio_code = await fetchCitizen(user.handle).then((citizen) => {
        return citizen.bio.match(/\[ueelife\:[A-Za-z0-9\-]+\]/i)[0]
    }).catch((err) => {
        console.error(err)
        return ""
    })
    if(!bio_code) {
        return apiError("Verification code not found in citizen bio.")
    } else {
        console.log('found in bio: ', bio_code)
    }
    if (ueelifeCode(ver_code) == bio_code) {
        const result = await verifyUser(user.user_id)
        return apiSuccess(result, "codes match!")
    } else {
        return apiError("codes no matchy")
    }
})

const ueelifeCode = (verificationCode) => {
    return `[ueelife:${verificationCode}]`
}