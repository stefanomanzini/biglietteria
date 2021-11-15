// imported packages
// Main Configuration JS Command, used to build the environment and to
// connect to the online MongoDB cluster

const express = require('express');
const app = express();

const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const cors = require('cors');

// middlewares
app.use(express.json({ limit: '1MB' }));
app.use(cors());

// =============================================================================



console.log('\n' + '----- | TICKETTWO\'S SERVER | -----' + '\n');

// imported routes
const usersRoute = require('./routes/users');
const eventsRoute = require('./routes/events');
const homeRoute = require('./routes/HTMLpages');
const paymentsRoute = require('./routes/payments');

// route middlewares
/*
endpoints -> frontend manipola risorse messe a disposizione con get e post volendo anche delete 
app.js (il presente file) è il "main" della web-app, e genera le seguenti quattro rotte
*/
//localhost:8080/seguito dalle rotte sottostanti. Accedendo a localhost:8080/ si va alla home
app.use('/api/users', usersRoute);
app.use('/api/events', eventsRoute);
app.use('/api/pay', paymentsRoute);
app.use('/', homeRoute);
//la creazione viene fatta dal file pages.js in /routes/pages.js

app.use(express.static('./front end/static'));
app.use(express.static('./icone eventi'));



// db connection ==================================================================
mongoose.connect(
    process.env.DB_CONNECTION_STRING,
    { useNewUrlParser: true, useUnifiedTopology: true},
    () => console.log('- connected to database')
);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// =================================================================================

// server port
const port = process.env.PORT;
app.listen(port, () => console.log('- listening on port ' + port));