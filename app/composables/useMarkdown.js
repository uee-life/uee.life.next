import markdownParser from '@nuxt/content/transformers/markdown'

export const useMarkdown = () => {
    const parseMarkdown = md => markdownParser.parse('custom.md', md)

    return {
        parseMarkdown
    }
}