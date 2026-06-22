const mongoose = require("mongoose");

// Message Schema - Messages expire in every 24 hours in any room

const messageSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    user: {
      type: String,
      required: true,
      trim: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    timestamp: { 
        type: Date, 
        default: Date.now, 
        expires: 86400 // You can customize this
    }
  }
);

module.exports = mongoose.model('Message', messageSchema);
