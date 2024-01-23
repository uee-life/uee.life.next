const cheerio = require('cheerio')
const {convertToMarkdown } = require('./markdown')

async function fetchCitizen(handle) {
    console.log('fetching citizen...', handle)

    const baseURI = 'https://robertsspaceindustries.com'
    const response = await $fetch(baseURI + '/citizens/' + handle)
    
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

async function fetchOrg(org) {
    const baseURI = "https://robertsspaceindustries.com"
    const resp = await $fetch(`${baseURI}/orgs/${org}`)

    const $ = cheerio.load(resp)
    let info = {}
    info.name = $('h1', '#organization').text().split("/")[0].trim()
    info.banner = baseURI + $('div.banner', '#organization').find('img').attr('src')
    info.logo = baseURI + $('div.logo', '#organization').find('img').attr('src')
    info.count = $('div.logo', '#organization').find('span').text().split(" ")[0]
    info.model = $('ul.tags', '#organization').find('li.model').text()
    info.roles = {}
    info.roles.primary = $('ul.focus', '#organization').find('li.primary').find('img').attr('alt')
    info.roles.secondary = $('ul.focus', '#organization').find('li.secondary').find('img').attr('alt')
    info.intro = convertToMarkdown($('div.join-us', '#organization').find('div.markitup-text').html())
    info.history = convertToMarkdown($('h2:contains("History")', '#organization').next().html())
    info.manifesto = convertToMarkdown($('h2:contains("Manifesto")', '#organization').next().html())
    info.charter = convertToMarkdown($('h2:contains("Charter")', '#organization').next().html())
    info.founders = await fetchOrgFounders(org)
    
    info.tag = org

    return info
}

async function fetchOrgFounders(org) {
    try {
        const url = 'https://robertsspaceindustries.com/api/orgs/getOrgMembers'
        const data = `{"symbol": "${org}", "rank":1, "search":""}`
        const resp = await $fetch(url, {
            method: 'POST',
            body: data,
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const $ = cheerio.load(resp.data.html)
        let founders = []
        $('li.member-item').each(function (i, el) {
            let handle = $(el).find('span.nick').text()
            let name = $(el).find('span.name').text()
            founders[i] = {}
            founders[i]['name'] = name
            founders[i]['handle'] = handle
        })
        return founders
    } catch (error) {
        console.error(error)
        return {error: "Org not found!"}
    }
}

module.exports = {
    fetchCitizen,
    fetchOrg
}