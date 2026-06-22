const mongoose = require("mongoose");

// OTP schema - OTP expires in 5 minutes

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  otp: {
    type: String,
    required: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now, 
    expires: 300 // You can customize this
}, 
});

module.exports = mongoose.model("Otp", otpSchema);