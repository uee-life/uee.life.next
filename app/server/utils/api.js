
export const apiError = (event, message="", errorCode=200) => {
    //setResponseStatus(event, errorCode)
    logger.error(`Error in ${event.context.path}: ${message}`)
    return {
        status: 'error',
        data: message
    }
}

export const apiSuccess = (data) => {
    logger.debug(`[API-SUCCESS] ${JSON.stringify(data)}`)
    return {
        status: 'success',
        data: data
    }
}

export const accessDenied = (event) => {
    logger.error(`Access Denied from user ${event.context.user.handle} to resource ${event.context.path}`)
    setResponseStatus(event, 403)
}