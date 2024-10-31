
export const apiError = (event, message="", errorCode=200) => {
    //setResponseStatus(event, errorCode)
    return {
        status: 'error',
        data: JSON.stringify(message)
    }
}

export const apiSuccess = (data) => {
    return {
        status: 'success',
        data: data
    }
}

export const accessDenied = (event) => {
    setResponseStatus(event, 403)
    console.warn(`Access Denied from user ${event.context.user.handle} to resource ${event.context.path}`)
}