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
    const url = "https://api.erkul.games/ptu/ships"
    const token = config.external.ERKUL_TOKEN

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
            id: ship.data.manufacturerData.data.nameSmall,
            name: ship.data.manufacturerData.data.name,
            description: ship.data.manufacturerData.data.description,
            model: "Manufacturer",
            official: true
        }

        if(!manufacturers.includes(manufacturer.id)) {
            manufacturers.push(manufacturer.id)
            console.log("new manufacturer: ", manufacturer.id)
            if (!await orgExists(manufacturer.id)) {
                console.log("doesn't exist, creating")
                console.log(manufacturer)
                await addManufacturer(manufacturer)
            }
        }

        const hps = parseHardpoints(ship.data.loadout)

        const shipObject = {
            identifier: ship.localName,
            model: ship.data.name,
            manufacturer: manufacturer.id,
            size: ship.data.size,
            cargo: ship.data.cargo,
            armor: ship.data.armor ? ship.data.armor.data.subType : '',
            speed_scm: ship.data.ifcs ? ship.data.ifcs.scmSpeed : 0,
            speed_max: ship.data.ifcs ? ship.data.ifcs.maxSpeed : 0,
            shield_type: ship.data.shield ? ship.data.shield.faceType : '',
            fuel_hydro: ship.data.fuelCapacity ?? 0,
            fuel_quant: ship.data.qtFuelCapacity ?? 0,
            max_crew: ship.data.vehicle.crewSize,
            career: (ship.data.vehicle.career ? ship.data.vehicle.career : ""), // formerly "type"
            role: ship.data.vehicle.role, // formerly "focus"
            description: (ship.data.description ? ship.data.description : ""),
            hardpoints: JSON.stringify(hps)
        }

        // add the ship to the graph
        await addShipModel(shipObject)

        shipList.push(shipObject)
    }

    // check if manufacturer exists already, if not, add it

    
    return shipList
}

const parseHardpoints = (hardpoints) => {
    const counts = {
        weapons: {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0,
            10: 0
        },
        missiles: {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0,
            10: 0
        }
    }

    for (const hp of hardpoints) {
        switch (true) {
            case hp.itemPortName.startsWith('hardpoint_weapon') || hp.itemPortName.startsWith('hardpoint_gun'):
                if (hp.itemTypes && hp.itemTypes.some(e => e.type == 'Turret' && (e.subType.startsWith('Gun') || e.subType == 'BallTurret') || e.type == 'WeaponGun')) {
                    if (hp.maxSize > 0) {
                        counts.weapons[hp.maxSize] += 1
                    }
                } else if (hp.itemTypes && hp.itemTypes.some(e => e.type == 'MissileLauncher')) { 
                    if (hp.maxSize > 0) {
                        counts.missiles[hp.maxSize] += 1
                    } else {
                        for (const item of hp.loadout) {
                            const size = parseInt(item.localName.split('_')[1].slice(1))
                            counts.missiles[size] += 1
                        }
                    }
                } else {
                    //console.log('unmatched weapon', hp)
                }
                break;

            case hp.itemPortName.startsWith('hardpoint_turret'):
                if (hp.itemTypes && hp.itemTypes.some(e => e.type == 'TurretBase') && hp.loadout) {
                    for (const item of hp.loadout) {
                        if (item.itemPortName.startsWith('hardpoint_weapon')) {
                            if (item.localName) {
                                const size = parseInt(item.localName.split('_')[2].slice(1))
                                counts.weapons[size] += 1
                            }
                        } else {
                            //console.log('unmatched turret', item)
                        }
                    }
                }
                break;
            case hp.itemPortName.startsWith('hardpoint_missile'):
                //console.log(hp)
                if (hp.loadout) {
                    for (const item of hp.loadout) {
                        if (item.localName) {
                            const size = parseInt(item.localName.split('_')[1].slice(1))
                            counts.missiles[size] += 1
                        }  
                    }
                } else {
                    //console.log('unmatched missile', hp)
                }
                
                
                break;
        }
    }

    return counts
}



async function addManufacturer(data) {
    /* if the manufacturer doesn't exist, add it here.
    Manufacturer data:
    - id: data.data.nameSmall [_AEGS] // prepend with _ to signify an official org
    - name: data.data.name [Aegis Dynamics]
    - description: data.data.description [Aegis grew to prominence as...]
    - type: "Manufacturer" [Manufacturer]
    - official: [true]
    */

    console.log("Manufacturer: ", data)

    await createOrganization(data, true)
}