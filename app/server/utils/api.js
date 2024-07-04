
export const apiError = (event, errorCode, message="") => {
    setResponseStatus(event, errorCode)
    return errorCode
}

export const apiSuccess = (event, data) => {
    return {
        status: 'success',
        data: data
    }
}