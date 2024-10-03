import neo4j from 'neo4j-driver'
import {uri, user, password}  from '../config/db_config'

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password), { disableLosslessIntegers: true })

export const writeQuery = async (query, params) => {
    logActivity('NEO4J-Write', `${query.trimStart().slice(0, 50).replace(/[\r\n]+/g, '')}...`)
    const session = driver.session({ database: 'neo4j' });
    let records = []
    let error = null
    try {
        const result = await session.executeWrite(tx => 
            tx.run(query, params)
        );

        records = result.records

        //TODO: put in a check here to make sure the write was successful
    } catch (err) {
        error = err
        console.error(`Something went wrong: ${err}`);
        console.error(`Query: ${query}`)
        console.error(`Params: ${JSON.stringify(params)}`)
    } finally {
        await session.close();
    }
    return {
        error: error,
        result: parseRecords(records)
    }
}

// return the full record set?
export const readQuery = async (query, params={}) => {
    logActivity('NEO4J-Read', `${query.trimStart().slice(0, 50).replace(/[\r\n]+/g, '')}...`)
    const session = driver.session({ database: 'neo4j' });

    let records = [];
    let error = null;
    try {
        // Moved to non-transactional reads, for performance gains.
        const result = await session.run(query, params, { database: 'neo4j' })

        records = result.records;
    } catch (err) {
        error = err
        console.error(`Something went wrong: ${err}`);
        console.error(`Query: ${query}`)
        console.error(`Params: ${JSON.stringify(params)}`)
    } finally {
        await session.close()
    }
    return {
        result: parseRecords(records),
        error: error
    }
}

export const parseRecords = (records) => {
    const result = []

    for (const res of records) {
        const rec = {}
        for (const key of res.keys) {
            const data = res._fields[res._fieldLookup[key]]

            if (neo4j.isInt(data)) {
                rec[key] = data
            } else if (neo4j.isNode(data) || neo4j.isRelationship(data) ) {
                if (data.properties) {
                    rec[key] = data.properties
                } else {
                    rec[key] = data
                }
                
            } else if (neo4j.isDateTime(data)) {
                rec[key] = data.toStandardDate()
            } else {
                rec[key] = data
            }
        }
        result.push(rec)
    }
    return result
}