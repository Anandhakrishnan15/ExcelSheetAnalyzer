// routes/dashboard.js
const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const protect = require('../middlewares/protect');

router.get("/counts", protect, dashboardController.getDashboardCounts);

module.exports = router;
