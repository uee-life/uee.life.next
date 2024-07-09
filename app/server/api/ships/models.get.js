

export default defineEventHandler(async (event) => {
    const data = await getAllShipModels()
    return apiSuccess(data)
})