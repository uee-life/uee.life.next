
export const neo4jToStandardDatetime = (dt) => {
    const {year, month, day, hour, minute, second, nanosecond } = dt

    const date = new Date(
        parseInt(year.low),
        parseInt(month.low) - 1,
        parseInt(day.low),
        parseInt(hour.low),
        parseInt(minute.low),
        parseInt(second.low),
        parseInt(nanosecond.low) / 1000000
    )

    return date
}