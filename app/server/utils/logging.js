
export const logActivity = async (type, details, user='Anonymous') => {
    console.log(`[${new Date().toUTCString()}]-[${setColor(type)}]-[${user}] ${details}`)
}

const setColor = (type) => {
    switch (true) {
        case type.startsWith('NEO4J-'):
            return `\x1b[36m${type}\x1b[0m`
        case type.startsWith('API-'):
            return `\x1b[33m${type}\x1b[0m`
        case type.startsWith('WEB-'):
            return `\x1b[35m${type}\x1b[0m`
        case type.startsWith('CACHE'):
            return `\x1b[32m${type}\x1b[0m`
        case type.startsWith('CACHE'):
            return `\x1b[31m${type}\x1b[0m`
        default:
            return type
    }
}

export const perfMon = async (func, params) => {
    const start = performance.now()
    const result = await func(params)
    const end = performance.now()
    console.info(`Performance (${func.name} : ${params}): ${end - start}`)
    return result
}