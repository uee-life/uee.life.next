

export const shipID = (shipid) => {
    return `UES-${ ('00' + shipid.toString(16).toUpperCase()).substr(-6) }`
}