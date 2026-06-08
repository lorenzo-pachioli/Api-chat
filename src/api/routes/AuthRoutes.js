const express = require('express');

const {
    signUpController,
    logInController,
    logOutController
} = require('../controller/AuthController');

const router = express.Router();

router.post('/signup', signUpController);
router.post('/login', logInController);

module.exports = router;