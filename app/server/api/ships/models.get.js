

export default defineEventHandler(async (event) => {
    const data = await getAllShipModels()
    return apiSuccess(data)
})

const getAllShipModels = async () => {
    console.log('Calling getAllShipModels')
    const data = {
        makes: [],
        models: []
    }
    let query = "MATCH (s:ShipModel) return s as model"
    const {result: models } = await readQuery(query)
    for (const m of models) {
        data.models.push(m.model)
    }

    query = "MATCH (m:Organization {type: 'Manufacturer'}) return m as make"
    const {result: makes} =  await readQuery(query)
    for (const m of makes) {
        data.makes.push(m.make)
    }
    return data
}