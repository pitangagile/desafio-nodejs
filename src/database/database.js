const mongoose = require("mongoose")

mongoose.connect('mongodb+srv://developer:3fRvK6sqhGkd5BBn@cluster0.or1hi.mongodb.net/<dbname>?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connection OK")
    })
    .catch((err) => {
        console.log(err)
    })


module.exports = mongoose