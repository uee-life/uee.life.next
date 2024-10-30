import * as rsi from '~/server/utils/rsi'

/* 
Currently this doesn't do much useful, as we don't store much data in our citizen entity
but this is here if that ever changes! 
*/
// Authenticated
// Authorized: Current user
export default defineAuthenticatedEventHandler(async (event) => {
    const user = await loadUser(event.context.user)
    const body = await readBody(event)

    if (await checkPermission(user, ['admin:all'])) {
        // invalidate the cache for the citizen
        await useStorage('cache').removeItem(`nitro:functions:rsi-fetchCitizen:${body.handle}.json`)
        await useStorage('cache').removeItem(`nitro:functions:rsi-fetchOrgList:${body.handle}.json`)

        // refetch data
        let citizen = await rsi.fetchCitizen(body.handle)

        citizen.verified = true
        await updateCitizen(citizen)

        return apiSuccess('Sync Successful!')
    } 
    
    return accessDenied(event)
})