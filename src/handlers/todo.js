const { Router } = require('express');
const { getDBHandle } = require("../lib/db");
const { v4: uuidv4 } = require('uuid');

const ResquestHandler = Router();

ResquestHandler.post('/to-dos', async (req, res) => {
    try {
        const dbHandler = await getDBHandle();
        const { title, description, priority } = req.body
        const id = uuidv4();
        console.log(title, description, priority);
        const creationInfo = await dbHandler.run(`
            INSERT INTO todo (id, title, description, priority)
            VALUES (?, ?, ?, ?)
        `, [id, title, description, priority]);

        const todos = await dbHandler.all(`
        SELECT * FROM todo
        `);

        console.log(todos);

        await dbHandler.close()
        res.status(200).json({
            message: "Todo added successfully",
            todos,
            creationInfo
        })
    } catch (err) {
        res.status(500).json({

            message: err.message
        })
    }
})


ResquestHandler.get('/to-dos', async (req, res) => {
    try {
        const dbHandler = await getDBHandle()

        const todos = await dbHandler.all(`
            SELECT * FROM todo
        `)

        await dbHandler.close()

        res.status(200).json({
            message: "Todos retrieved successfully",
            todos
        })

        if (!todos)
            res.status(404).json({
                message: "No todos found"
            })

    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
})
// get by priority
ResquestHandler.get('/to-dos/priority/:priority', async (req, res) => {
    try {
        const dbHandler = await getDBHandle()
        const { priority } = req.params;
        const todos = await dbHandler.all(`
            SELECT * FROM todo WHERE priority = ?
        `, [priority]);

        await dbHandler.close()

        res.status(200).json({
            message: "Todos retrieved successfully",
            todos
        })

        if (!todos)
            res.status(404).json({
                message: "No todos found"
            })


    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
})
// get by date
ResquestHandler.get('/to-dos/date/:dateCreated', async (req, res) => {
    try {

        const dbHandler = await getDBHandle()
        const { dateCreated } = req.params;
        const todos = await dbHandler.all(`
            SELECT * FROM todo WHERE dateCreated = ?
        `, [dateCreated]);

        await dbHandler.close()

        res.status(200).json({
            message: "Todos retrieved successfully",
            todos
        })

        if (!todos)
            res.status(404).json({
                message: "No todos found"
            })

    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
})


ResquestHandler.delete('/to-dos/:id', async (req, res) => {
    try {
        const dbHandler = await getDBHandle()

        const { id } = req.params

        console.log(id)

        const todoDeleted = await dbHandler.run(`
            DELETE FROM todo
            WHERE id = ?
        `, [id])

        await dbHandler.close()

        res.status(200).json({
            message: "Todo deleted successfully",
            todoDeleted
        })

        if (!todoDeleted)
            res.status(404).json({
                message: "No todo found"
            })
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
})

ResquestHandler.patch('/to-dos/:id', async (req, res) => {
    try {
        const dbHandler = await getDBHandle()

        const { id } = req.params
        const { title, description, state, priority } = req.body
        console.log(id, title, description, state, priority);
        const todoUpdated = await dbHandler.run(`
            UPDATE todo
            SET title = ?, description = ?, state = ?, priority = ?
            WHERE id = ?
        `, [title, description, state, priority, id])

        await dbHandler.close()

        res.status(200).json({
            message: "Todo updated successfully",
            todoUpdated
        })

        if (!todoUpdated)
            res.status(404).json({
                message: "No todo found"
            })
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
})

ResquestHandler.get('/to-dos/:id', async (req, res) => {
    try {
        const dbHandler = await getDBHandle()

        const { id } = req.params

        const todo = await dbHandler.get(`
            SELECT * FROM todo
            WHERE id = ?
        `, [id])

        await dbHandler.close()

        res.status(200).json({
            message: "Todo retrieved successfully",
            todo
        })

        if (!todo)
            res.status(404).json({
                message: "No todo found"
            })
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
})

module.exports = ResquestHandler;