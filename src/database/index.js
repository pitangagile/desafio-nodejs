const mongoose = require("mongoose");
const config = require("../config/env.json");
//mongoose.connect('mongodb+srv://desafio-nodejs:', { pass: '@desafionodejs.f1zo2.mongodb.net/myFirstDatabase?'});
mongoose.connect(config.connection_uri);

mongoose.Promise = global.Promise;

module.exports = mongoose;
