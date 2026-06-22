const mongoose = require("mongoose");


// Temporary user - Prevails before the user verifies his email using OTP - expires in 24 hours

const tempuserSchema = new mongoose.Schema({

 handlename: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now, 
    expires: 86400 // You can customize this
  },
}, { timestamps: true });

module.exports = mongoose.model("Tempuser", tempuserSchema);
