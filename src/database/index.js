const mongoose = require("mongoose");

//mongoose.connect('mongodb+srv://desafio-nodejs:', { pass: '@desafionodejs.f1zo2.mongodb.net/myFirstDatabase?'});
mongoose.connect("mongodb://localhost:27017/desafio-nodejs");

mongoose.Promise = global.Promise;

module.exports = mongoose;
