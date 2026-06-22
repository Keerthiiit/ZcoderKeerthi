const express = require('express')
const router = express.Router()
const { getMessages } = require('../controllers/messagecontroller')


router.post('/', getMessages);


module.exports = router