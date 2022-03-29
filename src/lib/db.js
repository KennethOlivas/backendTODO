const { open } = require("sqlite")
const sqlite3 = require("sqlite3")

const getDBHandle = async () => {
    try {
        const dbHandler = await open({
            filename: "./db/todo.db",
            driver: sqlite3.Database
        })
        if (!dbHandler)
            throw new Error("Could not open database")
        return dbHandler
    } catch (err) {
        console.error(`there was an error opening the database: ${err}`)
    }
}

const initializeDB = async () => {
    try {
        const dbHandler = await getDBHandle()
        await dbHandler.exec(`
            CREATE TABLE IF NOT EXISTS todo (
                id uuid PRIMARY KEY,
                title TEXT NOT NULL,
                dateCreated date NOT NULL default CURRENT_DATE, 
                dateUpdated date,
                priority integer max(5) default 1,
                description TEXT,
                state boolean default false
            );
        `)
        await dbHandler.close()
    }
    catch (err) {
        console.error(`there was an error opening the database: ${err.message}`)
    }
}

module.exports = {
    getDBHandle,
    initializeDB
}