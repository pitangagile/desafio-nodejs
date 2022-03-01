const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const cors = require("cors");

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).send({ message: "Server running" });
});

app.use(require("./src/app/controllers/AuthController"));

app.listen(process.env.PORT || 3000, () => {
  console.log(`App listening on port: ${process.env.PORT}...`);
});

module.exports = app;
