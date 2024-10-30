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
                throw createError({
                    statusCode: 401,
                    statusMessage: 'You are not authorized to use this API'
                })
            }
            // do something after
        } catch (err) {
            logger.error(err)
            return err
        }
    })