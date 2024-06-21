
export const apiError = (message) => {
    return {
        status: "error",
        message: message
    }
}

export const apiSuccess = (data, message="") => {
    return {
        status: "success",
        message: message,
        data: data
    }
}