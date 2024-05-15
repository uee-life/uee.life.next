const neo4j = require('neo4j-driver')
const {uri, user, password} = require('../config/db_config')

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password))

async function writeQuery(query, params) {
    const session = driver.session({ database: 'neo4j' });
    let error = null
    try {
        const result = await session.executeWrite(tx => 
            tx.run(query, params)
        );

        //TODO: put in a check here to make sure the write was successful
    } catch (err) {
        error = err
        console.error(`Something went wrong: ${err}`);
        console.error(`Query: ${query}`)
        console.error(`Params: ${JSON.stringify(params)}`)
    } finally {
        await session.close();
    }
    return error
}

// return the full record set?
async function readQuery(query, params) {
    const session = driver.session({ database: 'neo4j' });
    let records = [];
    let error = null;
    try {
        const result = await session.executeRead(tx =>
            tx.run(query, params)
        );

        records = result.records;

    } catch (err) {
        console.error(`Something went wrong: ${err}`);
        error = err
    } finally {
        await session.close()
    }
    return {
        result: records,
        error: error
    }
}

module.exports = {
    writeQuery,
    readQuery
}