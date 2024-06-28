import { fetchCitizen } from "~/server/utils/rsi"

export default defineEventHandler(async (event) => {
    const user = await loadUser(event.context.user)
    const ver_code = await getCitizen(user.handle, false, user).then((citizen) => {
        return citizen.verification_code ?? ""
    })
    if(!ver_code) {
        console.error('verification code not found. We need to make one.')
    } else {
        console.log('verification code: ', ver_code)
    }
    const bio_code = await fetchCitizen(user.handle).then((citizen) => {
        return citizen.bio.match(/\[ueelife\:[A-Za-z0-9\-]+\]/i)
    }).catch((err) => {
        console.error(err)
        return ""
    })
    if(!bio_code) {
        console.error('no verification code found in bio')
    } else {
        console.log('found in bio: ', bio_code)
    }
    if (user && ver_code && bio_code && ver_code == bio_code) {
        return apiSuccess(null, "codes match!")
    } else {
        return apiError("codes no matchy")
    }
})