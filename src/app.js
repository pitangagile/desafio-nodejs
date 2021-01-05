const express = require('express');
const app = express();
const database = require('./database');
const errorResponse = require('./utils/errorResponse');

// Init Mongo DB connection
database();

app.use(express.json()); // for parsing application/json

// Load application routes
app.use(require('./routes'));

// Handle not found route
app.all("*", (req, res, next) => {
  next(errorResponse('Resource not found', 404));
});

// Error handler
app.use((err, req, res, next) => {
  const errorCode = err.errorCode ? err.errorCode : 500;

  res.status(errorCode).json(errorResponse(
    err.message,
    err.errorCode
  ));
});


module.exports = app;