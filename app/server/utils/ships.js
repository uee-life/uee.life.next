import { readQuery, writeQuery } from "./neo4j"

export const getShipModel = async (identifier) => {
    // get ship static details
}

export const getAllShipModels = async () => {
    console.log('Calling getAllShipModels')
    const data = {}
    let query = "MATCH (s:ShipModel) return s"
    const ships = await readQuery(query)
    data.ships = ships.result.map((x) => x._fields[0].properties)

    query = "MATCH (m:Organization {type: 'Manufacturer'}) return m"
    const manufacturers =  await readQuery(query)
    data.manufacturers = manufacturers.result.map((x) => x._fields[0].properties)
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
            name: $name
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

export const getShip = async (identifier) => {
    // get ship instance
    const query =
        `MATCH (c:Citizen)--(s:Ship {id: $id})-[:INSTANCE_OF]->(m:ShipModel)
         RETURN c as owner,
                s as ship,
                m as info`
    const { result } = await readQuery(query, {id: identifier})
    console.log(result[0]._fields[0].properties)
    const ship = {
        owner: result[0]._fields[0].properties,
        ...result[0]._fields[1].properties,
        ...result[0]._fields[2].properties
    }
    return ship
}

export const getShipList = async (handle) => {
    console.log("Getting ships for ", handle)
    const query =
        `MATCH (c:Citizen)--(s:Ship)-[:INSTANCE_OF]->(m:ShipModel)
         WHERE c.handle =~ $handle
         RETURN s as ship,
                m as shipData`
    const result = await readQuery(query, {handle: "(?i)"+handle})
    const ships = []
    for (const res of result.result) {
        const ship = {
            ...res._fields[0].properties,
            ...res._fields[1].properties
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
        `MATCH (o:Organization)--(c:Citizen)--(s:Ship)-[:INSTANCE_OF]->(m:ShipModel)
         WHERE o.tag =~ $tag
         RETURN s as ship,
                m as shipData,
                c as owner`
    const result = await readQuery(query, {tag: "(?i)"+tag})
    const ships = []
    for (const res of result.result) {
        console.log(res._fields[2])
        const ship = {
            owner: res._fields[2].properties,
            ...res._fields[0].properties,
            ...res._fields[1].properties
        }
        //ship.data = res._fields[0].properties
        //ship.model = res._fields[1].properties
        ships.push(ship)
    }
    return ships
}