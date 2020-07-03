const express = require('express');
const morgan = require('morgan'); // http request debugger
const mongoose = require('mongoose'); // MongoDB ODM
const app = express();

// Configure the morgan to use the tiny format for logs
app.use(morgan('tiny'));

// Use the express.json request body parser
app.use(express.json());

// Confgiure enviroment varaibles
require('dotenv').config()

// Configure the routers
const recordRouter = require('./src/routes/recordRouter')();
app.use('/record', recordRouter);

module.exports = app;

