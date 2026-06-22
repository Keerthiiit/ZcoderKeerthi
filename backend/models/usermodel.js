const mongoose = require("mongoose");

// User model - You can also add a solution field to refer the solutions the user have made or an array containing handlenames to add a feature like friends of the users
const userSchema = new mongoose.Schema({

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
  description: {
    type: String,
    default: "Tech Enthusiast | Front-end Developer"
  },
  profilePic: {
    type: String,
    default: "https://th.bing.com/th/id/OIP.2_usfVap7erihpS_4ar0GwAAAA?r=0&rs=1&pid=ImgDetMain" 
  },
  bookmarks: [Number],
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
