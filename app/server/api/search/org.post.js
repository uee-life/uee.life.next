
// Public
export default defineEventHandler(async (event) => {
    const data = {
        sort: "default",
        search: "",
        commitment: [],
        roleplay: [],
        size: [],
        model: [],
        activity: [],
        language: [],
        recruiting: [],
        pagesize: 12,
        page: 1
    }
    const body = await readBody(event)

    data.search = body.search

    const baseURI = "https://robertsspaceindustries.com"
    const res = await $fetch(baseURI + '/api/orgs/getOrgs', {
        method: 'POST',
        body: data,
        headers: {
            origin: 'robertsspaceindustries.com'
        }
    })
    const org = res.data
    
    return apiSuccess(org)
})
