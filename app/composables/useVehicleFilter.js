export const vehicleFilter = (search, vehicles) => {
    return vehicles.filter(vehicle => {
        return vehicle.identifier.toLowerCase().includes(search.toLowerCase()) ||
            vehicle.name.toLowerCase().includes(search.toLowerCase()) ||
            vehicle.manufacturer.toLowerCase().includes(search.toLowerCase()) ||
            vehicle.model.toLowerCase().includes(search.toLowerCase()) ||
            vehicle.career.toLowerCase().includes(search.toLowerCase()) ||
            vehicle.role.toLowerCase().includes(search.toLowerCase()) //||
//            vehicle.size_text.toLowerCase().includes(search.value.toLowerCase()) ||
//            vehicle.owner.name.toLowerCase().includes(search.value.toLowerCase()) ||
//            vehicle.owner.handle.toLowerCase().includes(search.value.toLowerCase())
    })
}