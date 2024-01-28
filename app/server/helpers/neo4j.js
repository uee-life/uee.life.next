const neo4j = require('neo4j-driver')
const {uri, user, password} = require('../config/db_config')

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password))

async function writeQuery(query, params) {
    const session = driver.session({ database: 'neo4j' });
    try {
        const result = await session.executeWrite(tx => 
            tx.run(query, params)
        );

        // put in a check here to make sure the write was successful
    } catch (error) {
        console.error(`Something went wrong: ${error}`);
    } finally {
        await session.close();
    }
}

// return the full record set?
async function readQuery(query, params) {
    console.log('query: ', query)
    console.log('params: ', params)
    const session = driver.session({ database: 'neo4j' });
    let records = [];
    try {
        const result = await session.executeRead(tx =>
            tx.run(query, params)
        );

        records = result.records;

        result.records.forEach(record => {
            console.log(`Found record: ${record.get('system')}`)
        })
    } catch (error) {
        console.error(`Something went wrong: ${error}`);
    } finally {
        await session.close()
    }
    return records
}

module.exports = {
    writeQuery,
    readQuery
}