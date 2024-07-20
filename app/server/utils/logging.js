
export const logActivity = async (type, details, user='Anonymous') => {
    console.log(`[${new Date().toUTCString()}]-[${type}]-[${user}] ${details}`)
}