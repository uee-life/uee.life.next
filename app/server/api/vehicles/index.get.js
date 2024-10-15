// Public
export default defineEventHandler(async (event) => {
    const data = await getAllVehicleModels()
    return apiSuccess(data)
})

const getAllVehicleModels = async () => {
    const data = {
        makes: [],
        models: []
    }
    let query = "MATCH (s:VehicleModel) return s as model"
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