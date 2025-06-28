const express = require('express');
const router = express.Router();
const { uploadFile, getUploadFiles } = require('../controllers/uploadController')
const protect = require('../middlewares/protect');


router.post('/', protect, uploadFile )


router.get('/get', protect, getUploadFiles)

module.exports = router;
