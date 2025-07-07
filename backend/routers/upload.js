const express = require('express');
const router = express.Router();
const { uploadFile, getUploadFiles, downloadFileContent } = require('../controllers/uploadController')
const protect = require('../middlewares/protect');
const upload = require("../middlewares/multerConfig");


router.post('/', protect, upload.single("file"), uploadFile )


router.get('/get', protect, getUploadFiles)
router.get("/download", protect, downloadFileContent);


module.exports = router;
