const express = require ('express')
require('dotenv').config()

const mongoose = require('mongoose');
const cors = require('cors');

const routes = require('./src/routes')

const app = express();

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connection OK")
    })
    .catch((err) => {
        console.log(err)
    })

app.use(cors())

app.use(express.json())

app.use(routes)

app.listen(process.env.API_PORT, function(){
  console.log(process.env.API_NAME + ' ON ' + process.env.API_PORT)
});
