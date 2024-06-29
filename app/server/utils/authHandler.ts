import type { EventHandler, EventHandlerRequest } from 'h3'

export const defineAuthenticatedEventHandler = <T extends EventHandlerRequest, D> (
    handler: EventHandler<T, D>
): EventHandler<T, D> =>
    defineEventHandler<T>(async event => {
        try {
            // do something before
            console.log('doing authentication stuff')
            if (event.context.user) {
                return await handler(event)
            } else {
                return apiError('You must be authenticated to use this API')
            }
            // do something after
        } catch (err) {
            return apiError(err)
        }
    })