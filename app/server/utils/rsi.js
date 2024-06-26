const cheerio = require('cheerio')
const {convertToMarkdown } = require('./markdown')

const config = require('~/config.json')

async function validCitizen(handle) {
    const res = await fetchCitizen(handle)
    console.log(res)
    if (res) {
        return true
    } else {
        return false
    }
}

async function fetchCitizen(handle) {
    console.log('[srv] fetching citizen...', handle)

    const baseURI = 'https://robertsspaceindustries.com'
    const response = await $fetch(baseURI + '/citizens/' + handle, {
        headers: {
            'Cookie': `_rsi_device=${config.RSI_DEVICE}; Rsi-XSRF=${config.RSI_XSRF}; Rsi-Token=${config.RSI_TOKEN}`
        }
    })
    
    try {
        const $ = cheerio.load(response)
        let info = {}
        info.handle = handle
        if($('p:contains("authenticated")').text()) {
            console.error($('p:contains("authenticated")').text())
        }
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
        info.orgs = await fetchOrgList(handle)
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

    try {
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
        info.description = convertToMarkdown($('div.join-us', '#organization').find('div.markitup-text').html())
        info.history = convertToMarkdown($('h2:contains("History")', '#organization').next().html())
        info.manifesto = convertToMarkdown($('h2:contains("Manifesto")', '#organization').next().html())
        info.charter = convertToMarkdown($('h2:contains("Charter")', '#organization').next().html())
        info.founders = await fetchOrgFounders(org)
        
        info.tag = org

        return info
    } catch (error) {
        console.error(error)
        return null
    }
}

async function fetchOrgList(handle) {
    //TODO: Get logos here too
    console.log('[srv] fetching citizen...', handle)

    const baseURI = 'https://robertsspaceindustries.com'
    const response = await $fetch(baseURI + '/citizens/' + handle + '/organizations', {
        headers: {
            'Cookie': `_rsi_device=${config.RSI_DEVICE}; Rsi-XSRF=${config.RSI_XSRF}; Rsi-Token=${config.RSI_TOKEN}`
        }
    })
    
    try {
        let orgs = {
            main: null,
            affiliated: []
        }
        const $ = cheerio.load(response)
        
        const main = $('.main .info')[0]
        if (main) {
            orgs.main = {
                tag: $(main).find('a').prop('href').split('/')[2],
                name: $(main).find('a').text(),
                logo: baseURI + $('.main').find('.thumb').find('img').prop('src'),
                model: $('.main').find('.right-col').find('span:contains("Archetype")').next().text(),
                rank: {
                    title: $(main).find('.ranking').prev().find('strong').text(),
                    level: $(main).find('.ranking').find('.active').length
                }
            }
            const links = $('.affiliation').each( function (i, el) {
                orgs.affiliated.push({
                    tag: $(el).find('.info').find('a').prop('href').split('/')[2],
                    name: $(el).find('.info').find('a').text(),
                    logo: baseURI + $(el).find('.thumb').find('img').prop('src'),
                    rank: {
                        title: $(el).find('.ranking').prev().find('strong').text(),
                        level: $(el).find('.ranking').find('.active').length,
                    }
                })
            })
        }

        return orgs
    } catch (error) {
        console.error(error)
        return null
    }
}


//TODO: Can we deprecate this and just use the getOrgMembers function with rank=1?
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

//TODO: remove this. temporary until we get user verification back in
function getID(handle) {
    return 0
}

async function checkCitizens(members) {
    for(let i in members) {
        if(members[i].handle !== 'Redacted') {
            const id = await getID(members[i].handle)
            if(id !== 0) {
                members[i].verified = true
            }
        }
    }
    return members
}

function computeRank(stars) {
    let rank = 0

    if (stars) {
        const starsize = parseInt(stars.match(/width\:\ (.*)\%/)[1])
        if(starsize) {
            rank = starsize / 20
        }

    } else {
        rank = 0
    }

    return rank
}

async function fetchMembers(org, page=1, isMain=true, rank=0, handle='') {

    const url = "https://robertsspaceindustries.com/api/orgs/getOrgMembers"
    let i = 0
    const main = isMain ? "1" : "0"
    const orgRank = rank ? `, "rank": "${rank}"` : ""
    const data = `{"symbol": "${org}", "search":"", "pagesize": 32, "main_org": "${main}", "page": ${page}${orgRank}}`

    console.log(data)

    const resp = await $fetch(url, {
        method: 'POST',
        body: data,
        headers: {
            'Content-Type': 'application/json'
        }
    })

    let members = []
    const totalMembers = resp.data.totalrows
    
    const $ = cheerio.load(resp.data.html)

    $('li.member-item').each(function (i, el) {
        const handle = $(el).find('span.nick').text()
        const name = $(el).find('span.name').text()

        let thumb = 'https://robertsspaceindustries.com/rsi/static/images/account/avatar_default_big.jpg'
        const thumbimg = $(el).find('span.thumb').find('img')[0]
        if(thumbimg && thumbimg.attribs.src) {
            if(thumbimg.attribs.src.startsWith('https')) {
                thumb = thumbimg.attribs.src
            } else {
                thumb = `https://robertsspaceindustries.com${thumbimg.attribs.src}`
            }
        }

        const rank = computeRank($(el).find('span.stars').attr('style'))
        let stars = 0

        if(handle.trim() != '') {
            const member = {
                name: name,
                handle: handle,
                rank: rank,
                portrait: thumb,
                verified: false
            }
            members.push(member)
        } else {
            const member = {
                name: 'Redacted',
                handle: 'Redacted',
                rank: rank,
                portrait: thumb,
                verified: false
            }
            members.push(member)
        }
    })

    const result = {
        count: totalMembers,
        members: members
    }
    
    result.members = await checkCitizens(result.members)
    return result
}

async function fetchOrgRank(org, handle) {
    const res = await fetchMembers(org, undefined, undefined, handle=handle)
    const member = res.members[0]

    return parseInt(member.rank)
}

module.exports = {
    validCitizen,
    fetchCitizen,
    fetchOrg,
    fetchOrgList,
    fetchOrgFounders,
    fetchMembers,
    fetchOrgRank
}