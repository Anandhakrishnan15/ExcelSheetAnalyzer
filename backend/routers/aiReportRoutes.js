const express = require("express");
const router = express.Router();
const { generateAIReport, getAllReports, saveAIReportToChart, incrementdownloadCount } = require("../controllers/aiReportController");
const protect = require("../middlewares/protect");

router.post("/", protect, generateAIReport);
router.get("/", protect, getAllReports);
router.post("/save-to-chart", protect, saveAIReportToChart);
router.put("/increment-download", protect, incrementdownloadCount);

module.exports = router;