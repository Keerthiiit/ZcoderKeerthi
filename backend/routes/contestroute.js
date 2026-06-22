const express = require('express');
const router = express.Router();

// ✅ This must be without curly braces
const getContests = require('../controllers/contestcontroller');

// ✅ Use the function in the route
router.get('/', getContests);

module.exports = router;
