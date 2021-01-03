const express = require ('express')
require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
})

const mongoose = require('mongoose');
const cors = require('cors');

const routes = require('./routes.js')

const app = express();

require('./database/database.js')

app.use(cors())

app.use(express.json())

app.use(routes)

app.listen(process.env.PORT || 4000 , function(){
  console.log(process.env.API_NAME + ' ON ' + ( process.env.PORT || 4000 ))
});
