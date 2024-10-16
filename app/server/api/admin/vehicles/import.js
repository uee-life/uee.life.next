const config = useRuntimeConfig()

const manufacturers = []

const testdata = []

/**
 * New attributes:
 * - Fire extinguisher count
 * - Escape pod count *
 * - Countermeasure launcher count *
 * - Relay count *
 * - Shield count and size *
 * - Power plant count *
 * - Cooler count *
 * - Seat count *
 */

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

        /*if(!manufacturers.includes(manufacturer.id)) {
            manufacturers.push(manufacturer.id)
            console.log("new manufacturer: ", manufacturer.id)
            if (!await orgExists(manufacturer.id)) {
                console.log("doesn't exist, creating")
                console.log(manufacturer)
                await addManufacturer(manufacturer)
            }
        }*/
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
        countermeasures: 0,
        fire_extinguishers: 0,
        relays: 0,
        escape_pods: 0,
        seats: 0,
        tractors: 0,
        powerplants: {
            0: 0,
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0
        },
        coolers: {
            0: 0,
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0
        },
        qdrives: {
            0: 0,
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0
        },
        shields: {
            0: 0,
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0
        },
        weapons: {
            0: 0,
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
        turrets: {
            0: 0,
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
            0: 0,
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
                    } else {
                        counts.weapons[0] += 1
                    }
                } else if (hp.loadout) {
                    counts.weapons[0] += 1
                } else if (hp.itemTypes && hp.itemTypes.some(e => e.type == 'MissileLauncher')) { 
                    if (hp.maxSize > 0) {
                        counts.missiles[hp.maxSize] += 1
                    } else {
                        for (const item of hp.loadout) {
                            if (hp.localName) {
                                const size = parseInt(item.localName.split('_')[1].slice(1))
                                counts.missiles[size] += 1
                            } else {
                                counts.missiles[0] += 1
                            }
                            
                        }
                    }
                } else {
                    //console.log('unmatched weapon', hp)
                }
                break

            case hp.itemPortName.startsWith('hardpoint_turret'):
                if (hp.itemTypes && hp.itemTypes.some(e => e.type == 'TurretBase') && hp.loadout) {
                    for (const item of hp.loadout) {
                        if (item.itemPortName.startsWith('hardpoint_weapon')) {
                            if (item.localName) {
                                const size = parseInt(item.localName.split('_')[2].slice(1))
                                counts.turrets[size] += 1
                            } else {
                                counts.turrets[0] += 1
                            }
                        } else {
                            //console.log('unmatched turret', item)
                        }
                    }
                }
                break
            case hp.itemPortName.startsWith('hardpoint_missile'):
                if (hp.loadout) {
                    for (const item of hp.loadout) {
                        if (item.localName) {
                            const size = parseInt(item.localName.split('_')[1].slice(1))
                            counts.missiles[size] += 1
                        }  else {
                            counts.missiles[0] += 1
                        }
                    }
                } else {
                    //console.log('unmatched missile', hp)
                }
                
                
                break
            case hp.itemPortName.startsWith('hardpoint_countermeasure'):
                counts.countermeasures += 1
                break

            case hp.itemPortName.startsWith('hardpoint_power_plant'):
                if (hp.maxSize) {
                    counts.powerplants[hp.maxSize] += 1
                } else {
                    counts.powerplants[0] += 1
                }
                break

            case hp.itemPortName.startsWith('hardpoint_seat'):
                if (hp.itemTypes && hp.itemTypes[0].type == 'Seat') {
                    counts.seats += 1
                }
                break

            case hp.itemPortName.startsWith('hardpoint_cooler'):
                if (hp.maxSize) {
                    counts.coolers[hp.maxSize] += 1
                } else {
                    counts.coolers[0] += 1
                }
                break

            case hp.itemPortName.startsWith('hardpoint_shield_generator'):
                if (hp.maxSize) {
                    counts.shields[hp.maxSize] += 1
                } else {
                    if (hp.localName) {
                        const size = parseInt(hp.localName.split('_')[2].slice(1))
                        counts.shields[size] += 1
                    } else {
                        counts.shields[0] += 1
                    }
                }
                break

            case hp.itemPortName.startsWith('hardpoint_escape_pod') || hp.itemPortName.startsWith('hardpoint_esc_pod'):
                counts.escape_pods += 1
                break

            case hp.itemPortName.startsWith('hardpoint_relay'):
                if (hp.localName) {
                    const count = hp.localName.split('_')[1]
                    counts.relays += parseInt(count)
                } else {
                    counts.relays += 1
                }
                break

            case hp.itemPortName.startsWith('hardpoint_quantum_drive'):
                if (hp.maxSize) {
                    counts.qdrives[hp.maxSize] += 1
                } else if (hp.localName) {
                    const size = parseInt(hp.localName.split('_')[2].slice(1))
                    counts.qdrives[size] += 1
                } else {
                    counts.qdrives[0] += 1
                }
                break

            case hp.itemPortName.startsWith('hardpoint_powerplant'):
                if (hp.maxSize) {
                    counts.powerplants[hp.maxSize] += 1
                } else {
                    counts.powerplants[0] += 1
                }
                
                break

            case hp.itemPortName.startsWith('hardpoint_tractor_beam'):
                counts.tractors += 1
                break

            case hp.itemPortName.startsWith('hardpoint_extinguisher'):
                counts.fire_extinguishers += 1
                break

            default:
                break
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