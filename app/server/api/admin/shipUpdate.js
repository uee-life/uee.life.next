import { writeQuery } from "~/server/utils/neo4j"
import { createOrganization, orgExists } from "~/server/utils/organization"
import { addShipModel } from "~/server/utils/ships"
//import * as config from "~/config.json"

const config = useRuntimeConfig()

const manufacturers = []

export default defineAuthenticatedEventHandler(async (event) => {
    return bootstrap()
})

async function create_ship(ship) {
    /*
    ship properties:
    - name [Avenger Stalker]
    - size [2]
    - description [Initially designed as a ...]
    - hull.totalHP 
    - armor.data.health [1000]
    - ifcs.scmSpeed [260]
    - ifcs.maxSpeed [1425]
    - cargo [0]
    - manufacturerData.data.nameSmall [AEGS]
    - manufacturerData.data.name [Aegis Dynamics]
    - manufacturerData.data.description [Aegis grew to prominence as a...]
    */
    const query =
        `MERGE (s:Ship {
            ship_id: $id
            })
            RETURN s`
    const params = { 
        id: ship.id
    }
    const result = await writeQuery(query, params)
    return result
}

// RSI functions

async function bootstrap() {
    const url = "https://api.erkul.games/live/ships"
    const token = config.external.erkul

    const resp = await $fetch(url, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            'Origin': 'https://www.erkul.games',
            'Authorization': `Bearer ${token}`,
        }
    })

    //console.log(resp)

    const data = resp

    //const {systems, bodies} = await loadSystems(rsi.systems.resultset)

    //TODO: Get list of manufacturers we already have stored, so we don't have to check every time, and can add new ones as needed
    if (data.length > 0) {
        const ships = await loadShips(data)
        return {
            manufacturers: manufacturers,
            ships: ships,
        }
    } else {
        console.log(resp)
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

        // link to the manufacturer


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