// routes/savedGraphRoutes.js
const express = require("express");
const router = express.Router();
const protect = require('../middlewares/protect');
const { saveCharts, getMyCharts } = require("../controllers/savedGraphController");

router.post("/save", protect, saveCharts);
router.get("/my", protect, getMyCharts);

module.exports = router;
