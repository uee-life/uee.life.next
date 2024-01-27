

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
    console.log("body:", body)

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
    console.log(org)
    
    return org
})




/*
async function searchOrgs(query) {
    // update here to allow mulitple search objects/terms (i.e. searching by size)
    const searchData = {
        sort: "default",
        search: query.search,
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
    
    try {
        const { data } = await axios.post('https://robertsspaceindustries.com/api/orgs/getOrgs', searchData);
        return data
    } catch (error) {
        console.error(error)
        return {error: 'unable to search orgs'}
    }
}
*/