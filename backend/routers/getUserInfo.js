const express = require('express');
const router = express.Router();
const { getUserByID, getMe } = require('../controllers/userController');
const protect = require('../middlewares/protect');


router.get("/me", protect, getMe); 

module.exports = router;
