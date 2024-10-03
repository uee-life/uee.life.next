
export const ueeDate = (datestr) => {
    const date = new Date(datestr)
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate()
    const ueeDate = new Date(year + 930, month, day).toDateString()
    return ueeDate
}