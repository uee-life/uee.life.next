import cheerio from 'cheerio'

export const convertToMarkdown = (html) => {
    const $ = cheerio.load(html)

    $('h1').each(function (i, el) {
        $(el).replaceWith('# ' + $(el).text() + '\n\n')
    })
    $('h2').each(function (i, el) {
        $(el).replaceWith('## ' + $(el).text() + '\n\n')
    })
    $('h3').each(function (i, el) {
        $(el).replaceWith('### ' + $(el).text() + '\n\n')
    })
    $('h4').each(function (i, el) {
        $(el).replaceWith('#### ' + $(el).text() + '\n\n')
    })
    $('h5').each(function (i, el) {
        $(el).replaceWith('##### ' + $(el).text() + '\n\n')
    })
    $('h6').each(function (i, el) {
        $(el).replaceWith('###### ' + $(el).text() + '\n\n')
    })
    $('strong').each(function (i, el) {
        $(el).replaceWith('**' + $(el).text() + '**')
    })
    $('del').each(function (i, el) {
        $(el).replaceWith('~~' + $(el).text() + '~~')
    })
    $('code').each(function (i, el) {
        $(el).replaceWith('`' + $(el).text() + '`')
    })
    $('a').each(function (i, el) {
        $(el).replaceWith('[' + $(el).text() + '](' + $(el).attr('href') + ')')
    })

    $('ul').each(function(i, el) {
        $(el).find('li').each(function(i, el) {
            $(el).replaceWith('* ' + $(el).text())
        })
        $(el).replaceWith($(el).text().trim() + '\n')
    })
    $('ol').each(function(i, el) {
        $(el).find('li').each(function(i, el) {
            $(el).replaceWith('1. ' + $(el).text())
        })
        $(el).replaceWith($(el).text() + '\n')
    })

    $('blockquote').each(function (i, el) {
        $(el).find('br').each(function(i, el2) {
            $(el2).replaceWith('\n> ')
        })
        $(el).replaceWith('> ' + $(el).html().replace(/(\n)[^\&]/g, ''))
    })

    /*$('p').each(function (i, el) {
        $(el).replaceWith($(el).html())
    })*/

    return $.text().replace(/\t/g, '').replace(/\>\s+/, '> ')
}