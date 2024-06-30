import { updateCitizen } from "~/server/utils/citizen"
import * as rsi from '~/server/utils/rsi'
import { loadUser } from "~/server/utils/user"

/* 
Currently this doesn't do much useful, as we don't store much data in our citizen entity
but this is here if that ever changes! 
*/

export default defineAuthenticatedEventHandler(async (event) => {
    const user = await loadUser(event.context.user)
    console.log('syncing user: ', user)
    if (user) {
        let citizen = await rsi.fetchCitizen(user.handle)
        console.log("syncing: ", citizen)
        await updateCitizen(citizen)
        return {
            status: 'success',
            message: 'Sync Successful!'
        }
    } else {
        return {
            status: 'error',
            message: 'An error occurred syncing user, please try relogging to see if that fixes it.'
        }
    }
})