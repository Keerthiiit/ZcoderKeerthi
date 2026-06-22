const express = require('express')
const router = express.Router()
const multer = require('multer');
const { getMe, updateMe, getother, setbookmark } = require('../controllers/usercontroller');
const { updateValidation } = require('../middleware/updatevalid')

// Multer to decode form data
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/me', getMe);
router.post('/getother', getother);
router.put('/setbookmark', setbookmark);
router.put('/update', upload.single('profilePic'),  updateValidation, updateMe);


module.exports = router