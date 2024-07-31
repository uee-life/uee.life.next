import cheerio from "cheerio"
import { isAfter, formatDistance } from 'date-fns'

export const getFeeds = async (earliest) => {
    return [
        {
            type: 1,
            id: 'PLeBcPM4MDA6TYa5WSKlxeZv6htnJWJybc',
            source: 'Astro Historian',
            image: '/images/astropub.png'
        },
        {
            type: 1,
            id: 'PLbKKP9vFxVAz9cB0KpBA1KWlgcM9aCAsv',
            source: 'Morphologis',
            image: '/images/morphologis.png'
        },
        {
            type: 1,
            id: 'PLxwkX_IXK1UYmGVTSjuMIPnJX8p9vBcqW',
            source: 'Hubwire Galactic',
            image: '/images/zarkmedia.png'
        }
    ]
}

export const ytFeed = async (feed, earliest) => {
    const link = `https://rsshub.app/youtube/playlist/${feed.id}`
    let result = []
    await $fetch(link, {
        onResponse({ response }) {
            const items = []
            const $ = cheerio.load(response._data, {xmlMode: true})

            $('item').each((i, el) => {
                const item = {}
                item.source = feed.source
                item.source_img = feed.image
                item.id = $(el).find('guid').text()
                item.title = $(el).find('title').text()
                item.image = $(el).find('enclosure').attr('url')
                item.link = $(el).find('link').text()
                item.posted_date = new Date($(el).find('pubDate').text()).toUTCString()
                item.posted = formatDistance(new Date(item.posted_date), new Date()) + " ago"
                if(isAfter(new Date(item.posted_date), new Date(earliest))) {
                    items.push(item)
                }
            })
            result = sortItems(items)
        }
    })
    return result
}

function sortItems(items) {
    return items.sort((a, b) => (isAfter(new Date(a.posted_date), new Date(b.posted_date))) ? -1 : 1)
}