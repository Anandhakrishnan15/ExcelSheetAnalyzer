const express = require('express');
const router = express.Router();
const { getMe,
    blockUser,
    changeUserRole,
    deleteUser,
    revokeUserAccess } = require('../controllers/userController');
const protect = require('../middlewares/protect');
const isAdmin = require('../middlewares/isAdmin');


router.get("/me", protect, getMe); 

//Admin routes
router.patch('/:id/block', protect, isAdmin, blockUser);
router.patch('/:id/role', protect, isAdmin, changeUserRole);
router.delete('/:id', protect, isAdmin, deleteUser);
router.post('/:id/revoke', protect, isAdmin, revokeUserAccess);
module.exports = router;
