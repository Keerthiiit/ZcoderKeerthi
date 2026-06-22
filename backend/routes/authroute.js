const { signup, login, otpverify, resendOtp  } = require('../controllers/authcontroller');
const { signupValidation } = require('../middleware/credvalid');

const router = require('express').Router();

router.post('/login', login);
router.post('/signup', signupValidation, signup);
router.post('/otpverify', otpverify);
router.post('/resendotp', resendOtp);

module.exports = router;