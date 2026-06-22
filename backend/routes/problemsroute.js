const express = require('express')
const router = express.Router()
const { getFeaturedProblems, getProblems, getProblem } = require('../controllers/problemcontroller');


router.get('/featured', getFeaturedProblems);
router.post('/', getProblems);
router.post('/singleproblem', getProblem);


module.exports = router