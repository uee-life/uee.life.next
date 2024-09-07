export const filterShips = (search, ships) => {
    return ships.filter(ship => {
        return ship.identifier.toLowerCase().includes(search.toLowerCase()) ||
            ship.name.toLowerCase().includes(search.toLowerCase()) ||
            ship.manufacturer.toLowerCase().includes(search.toLowerCase()) ||
            ship.model.toLowerCase().includes(search.toLowerCase()) ||
            ship.career.toLowerCase().includes(search.toLowerCase()) ||
            ship.role.toLowerCase().includes(search.toLowerCase()) //||
//            ship.size_text.toLowerCase().includes(search.value.toLowerCase()) ||
//            ship.owner.name.toLowerCase().includes(search.value.toLowerCase()) ||
//            ship.owner.handle.toLowerCase().includes(search.value.toLowerCase())
    })
}