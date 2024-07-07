import type { EventHandler, EventHandlerRequest } from 'h3'

export const defineAuthenticatedEventHandler = <T extends EventHandlerRequest, D> (
    handler: EventHandler<T, D>
): EventHandler<T, D> =>
    defineEventHandler<T>(async event => {
        try {
            // do something before
            if (event.context.user) {
                return await handler(event)
            } else {
                return apiError(event, 'You must be authenticated to use this API', 401)
            }
            // do something after
        } catch (err) {
            return apiError(err)
        }
    })