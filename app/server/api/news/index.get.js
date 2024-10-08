import * as cheerio from 'cheerio'
import { isBefore, formatDistance, subMonths, subWeeks, subDays, subHours, subMinutes, subSeconds, subYears } from 'date-fns'

// public
export default defineEventHandler(async (event) => {
    let data = {"channel": "","series":"","type":"","text":"","sort":"publish_new","page":1}
    const query = await getQuery(event)
    for (const prop in query) {
        if(prop in data) {
            data[prop] = query[prop]
        }
    }
    
    let news = await rsiNews(data)

    const earliest = news[news.length - 1].posted_date

    if (data.series === 'news-update') {
        const feeds = await getFeeds()
        for (const feed of feeds) {
            if (feed.type == 1) {
                const yt = await ytFeed(feed, earliest)
                news = mergeNews(news, yt)
            } else if (feed.type == 2) {
                // placeholder. This should pass in the feed object for generic wordpress RSS feeds
                news = mergeNews(news, await wpFeed(earliest))
            }
        }
    } 
    
    return apiSuccess(news)
})

// Cached
const rsiNews = defineCachedFunction(async (data) => {
    try {
        const baseURI = "https://robertsspaceindustries.com"
        const response = await $fetch(baseURI + '/api/hub/getCommlinkItems', {
            method: 'POST',
            body: data
        })

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
        logActivity('CACHE', 'Updating RSI news cache')
        return news
    } catch (error) {
        console.error(error)
        return []
    }
}, {
    maxAge: 60 * 5,
    name: 'rsi-News',
    getKey: (data) => { return `${data.channel}-${data.series}-${data.page}`}
})

function computeDate(posted) {
    if(posted.startsWith('about')) {
        posted = posted.substring(6)
    }
    const [count, unit] = posted.split(' ')
    let date = null
    if (unit.startsWith('second')) {
        date = subSeconds(new Date(), count)
    } else if (unit.startsWith('minute')) {
        date = subMinutes(new Date(), count)
    } else if (unit.startsWith('hour')) {
        date = subHours(new Date(), count)
    } else if (unit.startsWith('day')) {
        date = subDays(new Date(), count)
    } else if (unit.startsWith('week')) {
        date = subWeeks(new Date(), count)
    } else if (unit.startsWith('month')) {
        date = subMonths(new Date(), count)
    } else if (unit.startsWith('year')) {
        date = subYears(new Date(), count)
    }
    return date.toUTCString()
}

function mergeNews(first, second) {
    let result = []
    while (first.length + second.length > 0) {
        if(first.length === 0) {
            // we hit the oldest date, discard any additional items from the second set
            // probably want to change this to store them to merge in "more news" situations
            second = []
        } else if (second.length === 0) {
            // no more results from the second feed. Just add all the remaining items form the first
            result = result.concat(first)
            first = []
        } else if (isBefore(new Date(first[0].posted_date), new Date(second[0].posted_date))) {
            result.push(second.shift())
        } else {
            result.push(first.shift())
        }
    }
    return result
}