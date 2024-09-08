import { readQuery, writeQuery, parseRecords } from "./neo4j"

export const getShipModel = async (identifier) => {
    // get ship static details
}


export const addShipModel = async (ship) => {
    // add ship static details and link to manufacturer
    const query =
        `MATCH (m:Organization {tag: $manufacturer, official: true})
         MERGE (s:ShipModel {identifier: $identifier})
         SET s = {
            identifier: $identifier,
            model: $model,
            manufacturer: $manufacturer,
            size: $size,
            cargo: $cargo,
            max_crew: $max_crew,
            career: $career,
            role: $role,
            description: $description
         }
         MERGE (m)<-[:MADE_BY]-(s)`

    const { error } = await writeQuery(query, ship)
    if (error) {
        return error
    }
    return null
}

export const removeShip = async (ship, handle) => {
    const query = 
        `MATCH (s:Ship {id: $id})-[:OWNED_BY]->(c:Citizen {handle: $handle}) DETACH DELETE s`
    
    const { error } = await writeQuery(query, {id: ship.id, handle: handle})
    if (error) {
        return error
    }
    return null
}

export const getShipOwner = async (identifier) => {
    const ship = await getShip(identifier)
    return ship.owner
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
        return error
    } 
}

export const updateCrew = async (ship, crew) => {
    const query = 
        `MATCH (Citizen {handle: $handle})-[r:CREW_OF]-(Ship {id: $id})
         SET r.role = $role`

    const params = {
        handle: crew.handle,
        id: ship,
        role: crew.role
    }
    const { error } = await writeQuery(query, params)
    if (error) {
        return error
    }
}

export const getShipStats = async () => {
    const query = 
        `match (a:Ship) 
         return {label: 'Ships', value: count(a)} as stats
         union all
         match (a:ShipModel) 
         return {label: 'Models', value: count(a)} as stats
         union all
         MATCH (n:Organization {official: true, type: 'Manufacturer'})
         return {label: 'Makes', value: count(n)} as stats`
    
    const { result } = await readQuery(query)
    return result
}