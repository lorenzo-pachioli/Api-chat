const express = require("express");
const {
    HealthCheckController
} = require('../controller/HealthCheckController');
const router = express.Router();

router.get('/health', HealthCheckController);

module.exports = router;