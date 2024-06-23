import { apiError, apiSuccess } from "./api"
import { readQuery, writeQuery, parseRecords } from "./neo4j"

export const getShipModel = async (identifier) => {
    // get ship static details
}

export const getAllShipModels = async () => {
    console.log('Calling getAllShipModels')
    const data = {}
    let query = "MATCH (s:ShipModel) return s"
    const {result: ships } = await readQuery(query)
    data.ships = ships.s

    query = "MATCH (m:Organization {type: 'Manufacturer'}) return m"
    const {result: manufacturers} =  await readQuery(query)
    data.manufacturers = manufacturers.m
    return data
}

export const addShipModel = async (ship) => {
    console.log("Adding ship: ", ship.model)
    // add ship static details and link to manufacturer
    const query =
        `MATCH (m:Organization {tag: $manufacturer, official: true})
         MERGE (m)<-[:MADE_BY]-(s:ShipModel {
            identifier: $identifier,
            model: $model,
            manufacturer: $manufacturer,
            size: $size,
            cargo: $cargo,
            max_crew: $max_crew,
            career: $career,
            role: $role,
            description: $description
         })`

    const error = await writeQuery(query, ship)
}

export const addShip = async (ship, handle) => {
    const query = 
        `MATCH (c:Citizen {handle: $handle})
         MATCH (m:ShipModel {identifier: $id})
         MERGE (m)<-[:INSTANCE_OF]-(s:Ship {
            id: left(randomUUID(), 8),
            name: $name,
            registered: datetime()
        })<-[:OWNER_OF]-(c)`

    const params = {
        handle: handle,
        id: ship.id,
        name: ship.name
    }
    const error = await writeQuery(query, params)
}

export const removeShip = async (ship, handle) => {
    const query = 
        `MATCH (s:Ship {id: $id})<-[:OWNER_OF]-(c:Citizen {handle: $handle}) DETACH DELETE s`
    
    const error = await writeQuery(query, {id: ship.id, handle: handle})
}

export const getShipList = async (handle) => {
    console.log("Getting ships for ", handle)
    const query =
        `MATCH (c:Citizen)-[:OWNER_OF]-(s:Ship)-[:INSTANCE_OF]->(m:ShipModel)
         WHERE c.handle =~ $handle
         RETURN s as ship,
                m as shipData`
    const { result } = await readQuery(query, {handle: "(?i)"+handle})
    const ships = []
    for (const res of result) {
        const ship = {
            ...res.ship,
            ...res.shipData
        }
        //ship.data = res._fields[0].properties
        //ship.model = res._fields[1].properties
        ships.push(ship)
    }
    return ships
}

export const getOrgShipList = async (tag) => {
    console.log("Getting ships for org", tag)
    const query =
        `MATCH (o:Organization)--(c:Citizen)-[:OWNER_OF]-(s:Ship)-[:INSTANCE_OF]->(m:ShipModel)
         WHERE o.tag =~ $tag
         RETURN s as ship,
                m as shipData,
                c as owner`
    const result = await readQuery(query, {tag: "(?i)"+tag})
    const ships = []
    for (const res of result.result) {
        const ship = {
            owner: res.owner,
            ...res.ship,
            ...res.shipData
        }
        //ship.data = res._fields[0].properties
        //ship.model = res._fields[1].properties
        ships.push(ship)
    }
    return ships
}

export const getShip = async (identifier) => {
    // get ship instance
    const query =
        `MATCH (c:Citizen)-[:OWNER_OF]-(s:Ship {id: $id})-[:INSTANCE_OF]->(m:ShipModel)
         RETURN c as owner,
                s as ship,
                m as info`
    const { result } = await readQuery(query, {id: identifier})
    // TODO: Check this actually returns a ship, else return an empty result.
    if (result[0]) {
        const ship = {
            owner: result[0].owner,
            ...result[0].ship,
            ...result[0].info
        }
        return ship
    } else {
        return apiError("Ship not found")
    }
}

export const getCrew = async (identifier) => {
    const query = 
        `MATCH (c:Citizen)-[r:CREW_OF]->(s:Ship {id: $id})
         RETURN c as citizen,r as relationship`
    
    const { result, error } = await readQuery(query, {id: identifier})
    
    const crew = []
    for (const res of result) {
        //console.log(res)
        crew.push({
            citizen: res.citizen,
            role: res.relationship.role
        })
    }
    return crew    
}

export const addCrew = async (ship, crew) => {
    const query = 
        `MATCH (c:Citizen {handle: $handle})
         MATCH (s:Ship {id: $id})
         MERGE (c)-[:CREW_OF {role: $role}]->(s)`

    const params = {
        id: ship,
        handle: crew.handle,
        role: crew.role
    }
    console.log(query, params)
    const { error } = await writeQuery(query, params)
    return apiSuccess(error, "Crewmember Added")
}

export const removeCrew = async (ship, handle) => {
    const query = 
        `MATCH (Citizen {handle: $handle})-[r:CREW_OF]-(Ship {id: $id})
         DELETE r`
    
    const params = {
        id: ship,
        handle: handle
    }
    const { error } = await writeQuery(query, params)
    if (error) {
        return apiError(error)
    } else {
        return apiSuccess(null, "Crewmember Removed")
    }
}