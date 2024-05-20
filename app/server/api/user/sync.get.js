import { useUser } from "~/composables/auth"
import { updateCitizen } from "~/server/utils/citizen"
import * as rsi from '~/server/utils/rsi'
import { loadUser } from "~/server/utils/user"

export default defineEventHandler(async (event) => {
    if (event.context.user) {
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
    } else {
        console.log("user not logged in...")
        return {
            status: 'error',
            message: 'Unauthorized: You must be logged in to use this API.'
        }
    }
})