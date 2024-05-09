import * as cheerio from 'cheerio'

export default defineEventHandler(async (event) => {
    const query = await getQuery(event)
    return await fetchCitizen(query["handle"])
})

async function fetchCitizen(handle) {
    console.log('[rsi] fetching citizen...', handle)

    const baseURI = 'https://robertsspaceindustries.com'
    const response = await $fetch(baseURI + '/citizens/' + handle)

    console.log(response.status)
    
    try {
        const $ = cheerio.load(response)
        let info = {}
        info.handle = handle
        info.record = $('span:contains("UEE Citizen Record")', '#public-profile').next().text()
        info.name = $('div.profile.left-col', '#public-profile').find('div.info').find('p.entry').find('strong.value').html()
        info.bio = $('span:contains("Bio")', '#public-profile').next().text()
        info.enlisted = $("span:contains('Enlisted')", '#public-profile').next().text()
        info.portrait = 'https://robertsspaceindustries.com/rsi/static/images/account/avatar_default_big.jpg'
        let image = $('div.thumb', '#public-profile').children()[0]
        if (image && image.attribs.src) {
            if(image.attribs.src.startsWith('https')) {
                info.portrait = image.attribs.src
            } else {
                info.portrait = `${baseURI}${image.attribs.src}`
            }
        }
        info.org = $('span:contains("Spectrum Identification (SID)")', '#public-profile').next().text()
        if(info.org) {
            info.orgTitle = $('span:contains("Organization rank")', '#public-profile').next().text()
            info.orgRank = 'Grand Mugglewump'//await fetchOrgRank(info.org, info.handle)
        } else {
            info.orgTitle = ''
            info.orgRank = 0
        }
        info.website = $('span:contains("Website")', '#public-profile').next().attr('href') || ''
        info.verified = 0
        return info
    } catch (error) {
        console.error(error)
        return null
    }
}