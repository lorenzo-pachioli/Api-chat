const express = require('express');

const {
    signUpController,
    logInController,
    logInController2,
    logOutController,
    authMeController
} = require('../controller/AuthController');

const router = express.Router();

router.post('/signup', signUpController);
router.post('/login', logInController2);
router.post('/logout', logOutController);
router.get('/me', authMeController);

module.exports = router;