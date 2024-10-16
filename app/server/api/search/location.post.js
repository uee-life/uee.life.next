//MATCH (n:Location) WHERE n.code = "(?i).*hel.*" OR n.description =~ "(?i).*HEL.*" RETURN n

export default defineEventHandler(async (event) => {

    const body = await readBody(event)

    const results = await searchLocation(body.search)
    
    if (results) {
        return apiSuccess(results)
    } else {
        return apiError(event, 'Failed to access search API', 500)
    }
})

const searchLocation = async (search) => {
    const query = `MATCH (n:Location) WHERE n.code =~ $search RETURN n`
    
    const params = {
        search: `(?i).*${search}.*`
    }

    // Curly brackets causes the object to be deconstructed and only return what we're asking
    const {result} = await readQuery(query, params)

    const locations = []
    for (const res of result){
        locations.push(res.n)
    }

    return locations
}