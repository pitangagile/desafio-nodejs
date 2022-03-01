const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).send("Server is running");
});

require("./app/controllers/AuthController")(app);

app.listen(3000);

module.exports = app;
