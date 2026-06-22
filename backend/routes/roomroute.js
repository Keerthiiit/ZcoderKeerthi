const express = require('express')
const router = express.Router()
const { getRooms, getRoom } = require('../controllers/roomcontroller')


router.post('/getrooms', getRooms);
router.post('/singleroom', getRoom);


module.exports = router