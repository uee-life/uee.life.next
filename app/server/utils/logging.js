
export const logActivity = async (type, details, user='Anonymous') => {
    console.log(`[${new Date().toUTCString()}]-[${type}]-[${user}] ${details}`)
}

export const perfMon = async (func, params) => {
    const start = performance.now()
    const result = await func(params)
    const end = performance.now()
    console.info(`Performance (${func.name} : ${params}): ${end - start}`)
    return result
}