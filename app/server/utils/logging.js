import winston from 'winston'
import winstonDailyFileTransport from 'winston-daily-rotate-file'

const dailyRotateFileTransport = new winstonDailyFileTransport({
    filename: 'nitro-%DATE%.log',
    dirname: 'logs',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
})

export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(), // Log to console
        dailyRotateFileTransport
    ]
})

export const logActivity = async (type, details, meta={handle: 'Anonymous'}) => {
    //logger.info(`[${new Date().toUTCString()}]-[${setColor(type)}]-[${user}] ${details}`)
    if (meta) {
        meta.type = type
    }
    
    logger.info(`${details}`, meta)
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
    logger.debug(`Performance (${func.name} : ${params}): ${end - start}`)
    return result
}