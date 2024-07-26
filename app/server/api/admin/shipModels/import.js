const config = useRuntimeConfig()

const manufacturers = []

// Authenticated
// Authorized [admin:all]
export default defineAuthenticatedEventHandler(async (event) => {
    const user = await loadUser(event.context.user)
    if (await checkPermission(user, ['admin:all'])) {
        return apiSuccess(await bootstrap())
    }
    return accessDenied(event)
})

// RSI functions
async function bootstrap() {
    console.log("Importing ships")
    const url = "https://api.erkul.games/live/ships"
    const token = config.external.ERKUL_TOKEN

    console.log(token)

    const resp = await $fetch(url, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            'Origin': 'https://www.erkul.games',
            'Authorization': `Bearer ${token}`,
        },
        onResponse({ response }) {
            // check why this isn't working...
        }
    })

    console.log(resp)

    const data = resp

    if (data.length > 0) {
        const ships = await loadShips(data)
        return {
            manufacturers: manufacturers,
            ships: ships,
        }
    } else {
        return {
            ships: resp
        }
    }
}

async function loadShips(ships) {
    const shipList = []

    for (const ship of ships) {
        const manufacturer = {
            tag: ship.data.manufacturerData.data.nameSmall,
            name: ship.data.manufacturerData.data.name,
            description: ship.data.manufacturerData.data.description,
            model: "Manufacturer",
            official: true
        }

        if(!manufacturers.includes(manufacturer.tag)) {
            manufacturers.push(manufacturer.tag)
            console.log("new manufacturer: ", manufacturer.tag)
            if (!await orgExists(manufacturer.tag)) {
                console.log("doesn't exist, creating")
                console.log(manufacturer)
                await addManufacturer(manufacturer)
            }
        }

        const shipObject = {
            identifier: ship.localName,
            model: ship.data.name,
            manufacturer: manufacturer.tag,
            size: ship.data.size,
            cargo: ship.data.cargo,
            max_crew: ship.data.vehicle.crewSize,
            career: (ship.data.vehicle.career ? ship.data.vehicle.career : ""), // formerly "type"
            role: ship.data.vehicle.role, // formerly "focus"
            description: (ship.data.description ? ship.data.description : ""),
        }

        // add the ship to the graph
        await addShipModel(shipObject)

        shipList.push(shipObject)
    }

    // check if manufacturer exists already, if not, add it

    
    return shipList
}



async function addManufacturer(data) {
    /* if the manufacturer doesn't exist, add it here.
    Manufacturer data:
    - tag: data.data.nameSmall [_AEGS] // prepend with _ to signify an official org
    - name: data.data.name [Aegis Dynamics]
    - description: data.data.description [Aegis grew to prominence as...]
    - type: "Manufacturer" [Manufacturer]
    - official: [true]
    */

    console.log("Manufacturer: ", data)

    await createOrganization(data, true)
}