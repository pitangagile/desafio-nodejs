const express = require('express');
const router = express.Router();

const userRouter = require('./user.js');

router.use('/', userRouter);

module.exports = router;