
export const ueeDate = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate()
    const ueeDate = new Date(year + 930, month, day).toDateString()
    return ueeDate
}