const express = require('express');
const router = express.Router();
const userServices = require('../services/user.js');
const userValidators = require('../validators/user.js');

router.post('/signup', userValidators.signUpRequest, userServices.signUp);
router.post('/signin', userValidators.signInRequest, userServices.signIn);
router.get('/me', userServices.me);

module.exports = router;