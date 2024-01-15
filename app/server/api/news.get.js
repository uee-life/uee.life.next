import * as cheerio from 'cheerio'
import { sub, isBefore, formatDistance, differenceInMilliseconds } from 'date-fns'

export default defineEventHandler(async (event) => {
    const baseURI = "https://robertsspaceindustries.com"
    const response = await $fetch(baseURI + '/api/hub/getCommlinkItems', {method: 'POST'})

    const news = []

    const $ = cheerio.load(response.data)

    $('a').each(function (n, el) {
        if($(el).attr('href')) {
            const art = {}
            art.source = 'Spectrum'
            art.source_img = '/images/spectrum.png'
            art.title = $(el).find('div.title').text()
            art.link = baseURI + $(el).attr('href')
            art.id = art.link.split('/').slice(-1)[0].split('-')[0]
            const bg = $(el).find('div.background')
            if(bg.attr('style')) {
                art.image = bg.attr('style').split("'")[1]
            } else {
                art.image = baseURI + "/media/jkfgas4ihmfghr/channel_item_full/BookReport_FI_2.jpg"
            }
            if(!art.image.startsWith('http')) {
                art.image = baseURI + art.image
            }

            art.posted = $(el).find('div.time_ago').find('span.value').text()
            if(art.posted.includes('ago')) {
                art.posted_date = computeDate(art.posted)
            } else {
                art.posted_date = new Date(art.posted).toUTCString()
                art.posted = formatDistance(new Date(art.posted_date), new Date()) + " ago"
            }
            news.push(art)
        }
    })
    return news
    return {
        news
    }
})

function computeDate(posted) {
    if(posted.startsWith('about')) {
        posted = posted.substring(6)
    }
    const [count, unit] = posted.split(' ')
    let date = null
    if (unit.startsWith('second')) {
        date = sub(new Date(), {seconds: count})
    } else if (unit.startsWith('minute')) {
        date = sub(new Date(), {minutes: count})
    } else if (unit.startsWith('hour')) {
        date = sub(new Date(), {hours: count})
    } else if (unit.startsWith('day')) {
        date = sub(new Date(), {days: count})
    } else if (unit.startsWith('week')) {
        date = sub(new Date(), {weeks: count})
    } else if (unit.startsWith('month')) {
        date = sub(new Date(), {months: count})
    } else if (unit.startsWith('year')) {
        date = sub(new Date(), {years: count})
    }
    return date.toUTCString()
}