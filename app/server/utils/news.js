import cheerio from "cheerio"
import { isAfter, formatDistance } from 'date-fns'

export const getFeeds = async (earliest) => {
    return [
        {
            type: 1,
            id: 'PLeBcPM4MDA6SAUOgx7ZPZRqBRPGoeQD0i',
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
    const link = `https://www.youtube.com/feeds/videos.xml?playlist_id=${feed.id}`
    let result = []
    await $fetch(link, {
        onResponse({ response }) {
            const items = []
            const $ = cheerio.load(response._data, {xmlMode: true})

            $('entry').each((i, el) => {
                const item = {}
                item.source = feed.source
                item.source_img = feed.image
                item.id = $(el).find('id').text()
                item.title = $(el).find('title').text()
                item.image = $(el).find('media\\:group').find('media\\:thumbnail').attr('url')
                item.link = $(el).find('link').attr('href')
                item.posted_date = new Date($(el).find('published').text()).toUTCString()
                item.posted = formatDistance(new Date(item.posted_date), new Date()) + " ago"
                if(isAfter(new Date(item.posted_date), new Date(earliest))) {
                    items.push(item)
                }
            })
            result = sortItems(items)
        },
        onResponseError({error}) {
            logger.error(error)
        }
    }).catch(e => {
        logger.error(e)
        return []
    })
    return result
}

function sortItems(items) {
    return items.sort((a, b) => (isAfter(new Date(a.posted_date), new Date(b.posted_date))) ? -1 : 1)
}

export const ytFeed2 = async (feed, earliest) => {
    const link = `https://www.youtube.com/embed/videoseries?list=${feed.id}`
    let result = []
    await $fetch(link, {
        onResponse({ response }) {
            const items = []
            const $ = cheerio.load(response._data, {xmlMode: false})
            const script = $('script')[3].children[0].data.replace(/\\/g, '')
            //const json = JSON.parse(script)
            const parsed = script.split('\n')[1].split('contents":[{')[1].split('}],"currentIndex')[0].split('}},{')
            for (const i of parsed) {
                logger.debug(`{${i}}}`)
                const json = JSON.parse(`{${i}}}`).playlistPanelVideoRenderer
                logger.debug(json.title.runs)
                const item = {
                    source: feed.source,
                    source_img: feed.image,
                    id: json.videoId,
                    title: json.title.runs[0].text,
                    image: json.thumbnail.thumbnails[2].url,
                    link: `https://youtu.be/${json.videoId}`,
                    posted_date: '',
                    posted: ''
                }
            }
            result = []
        }
    })
}