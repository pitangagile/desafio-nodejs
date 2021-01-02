require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
})

const mongoose = require("mongoose")

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connection OK")
    })
    .catch((err) => {
        console.log(err)
    })


module.exports = mongoose