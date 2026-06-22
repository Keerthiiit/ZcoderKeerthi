const mongoose = require("mongoose");

// Room schema 

const roomSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    topic: {
      type: String,
      required: true,
      trim: true
    },
    participants: {
        type: Number,
        default: 5
    }
  },
  { timestamps: true } 
);

module.exports = mongoose.model('Room', roomSchema);
