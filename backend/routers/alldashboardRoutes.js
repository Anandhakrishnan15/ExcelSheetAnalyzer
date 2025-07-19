const express = require("express");
const router = express.Router();
const protect = require("../middlewares/protect");
const isAdmin = require("../middlewares/isAdmin");
const dashboardController = require("../controllers/alldashboardController");
const { searchUsers } = require("../controllers/adminController");
const { getAllAdminDashboardStats } = require("../controllers/getAllAdminDashboardStats");
const { getFullUserDataById } = require("../controllers/getFullUserDataById");

router.get("/dashboard/global", protect,
    isAdmin, dashboardController.getGlobalDashboardStats);

router.get("/dashboard/users", protect,
    isAdmin, dashboardController.getAllUserStats);

router.get("/search-users", protect,
    isAdmin, searchUsers);

router.get("/admin-dashboard-stats", protect, isAdmin, getAllAdminDashboardStats);
router.get("/admin/user/:id", protect, isAdmin,  getFullUserDataById);

module.exports = router;
