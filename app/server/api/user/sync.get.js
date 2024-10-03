import * as rsi from '~/server/utils/rsi'

/* 
Currently this doesn't do much useful, as we don't store much data in our citizen entity
but this is here if that ever changes! 
*/
// Authenticated
// Authorized: Current user
export default defineAuthenticatedEventHandler(async (event) => {
    const user = await loadUser(event.context.user)
    if (user && user.verified) {
        let citizen = await rsi.fetchCitizen(user.handle)
        await updateCitizen(citizen)
        // invalidate the cache for the citizen
        await useStorage('cache').removeItem(`nitro:functions:rsi-fetchCitizen:${user.handle}.json`)
        return apiSuccess('Sync Successful!')
    } else {
        return apiError(event, 401, 'Sync error')
    }
})