const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../../config/env.json");

function validatePhones(phones) {
  return phones
    .map((phone) => {
      if (
        typeof phone.number != "number" ||
        typeof phone.area_code != "number" ||
        typeof phone.country_code != "string"
      ) {
        return true;
      } else {
        return false;
      }
    })
    .includes(true);
}

router.post("/signup", async function signUp(req, res) {
  try {
    const { firstName, lastName, email, password, phones } = req.body;
    if (!firstName || !lastName || !email || !password || !phones) {
      return res.status(400).send({ message: "Missing fields", errorCode: 1 });
    }
    if (
      typeof firstName != "string" ||
      typeof lastName != "string" ||
      typeof email != "string" ||
      typeof password != "string" ||
      Array.isArray(phones) == false ||
      validatePhones(phones) == true
    ) {
      return res.status(400).send({ message: "Invalid fields", errorCode: 2 });
    }
    if (await User.findOne({ email })) {
      return res
        .status(400)
        .send({ message: "Email already registered", errorCode: 3 });
    }
    const user = await User.create(req.body);
    const token = jwt.sign({ id: user.id, email: user.email }, config.secret, {
      expiresIn: 3600,
    });

    user.password = undefined;
    return res.status(201).send({ token });
  } catch (error) {
    return res
      .status(error.code)
      .send({ message: "Server error", errorCode: 0 });
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ message: "Missing fields", errorCode: 10 });
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !bcrypt.compare(password, user.password)) {
    return res
      .status(404)
      .send({ message: "Invalid e-mail or password", errorCode: 11 });
  }
  await User.findByIdAndUpdate(user.id, { last_login: Date.now() });
  const token = jwt.sign({ id: user.id }, config.secret, { expiresIn: 3600 });
  res.status(200).send({ token });
});

router.get("/me", async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).send({ message: "Unauthorized", errorCode: 100 });
  }
  const token_auth = header.split(" ");

  if (token_auth[0] != "Bearer") {
    return res.status(401).send({ message: "Bearer flag is required" });
  }

  jwt.verify(token_auth[1], config.secret, async (err, decoded) => {
    if (err?.expiredAt < Date.now()) {
      return res
        .status(401)
        .send({ message: "Unauthorized - invalid session", errorCode: 101 });
    }
    if (err) {
      return res.status(401).send({ message: "Unauthorized", errorCode: 102 });
    }
    const user = await User.findById(decoded.id).select("-_id -__v");

    return res.status(200).send(user);
  });
});

module.exports = (app) => app.use(router);
