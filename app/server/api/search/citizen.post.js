

export default defineEventHandler(async (event) => {
    let data = {
        "community_id": "",
        "text": "flint",
        "ignore_self": true
    }
    const body = await readBody(event)

    for (const prop in body) {
        if (prop in data) {
            data[prop] = body[prop]
        }
    }

    const baseURI = "https://robertsspaceindustries.com"
    const res = await $fetch(baseURI + '/api/spectrum/search/member/autocomplete', {
        method: 'POST',
        body: data,
        headers: {
            origin: 'robertsspaceindustries.com'
        }
    })
    const citizen = {}
    
    if (res.success) {
        const data = []
        const hits = res.data.members
        for (const i in hits) {
            const hit = hits[i]
            let avatar = 'https://robertsspaceindustries.com/rsi/static/images/account/avatar_default_big.jpg'
            if (hit.avatar !== null) {
                avatar = hit.avatar
            }
            let org = ""
            if (hit.meta.badges.length > 1) {
                org = hit.meta.badges[1].name
            }
            const cit = {
                handle: hit.nickname,
                name: hit.displayname,
                portrait: avatar,
                org: org
            }
            data.push(cit)
        }
        return apiSuccess(data)
    } else {
        return apiError(event, 'Failed to access search API', 500)
    }
})