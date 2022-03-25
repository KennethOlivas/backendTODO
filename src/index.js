const express = require('express');
const Express = require('express');
const ResquestHandler = require('./handlers/todo');
const { initializeDB } = require('./lib/db');
const cors = require('cors');

const App = Express();
App.use(cors());
App.use(Express.json());
App.use(Express.urlencoded({ extended: false }));
App.use(ResquestHandler);
App.listen(3000, () => {
    console.log('Server running on port 3000');
    initializeDB().then(() => { 
        console.log('Database initialized');}); 
});
