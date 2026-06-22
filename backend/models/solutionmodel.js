const mongoose = require("mongoose");

// Solution schema - I didn't make the pid, handlenames as foreign keys , but you can make them refer the problems and user database

const solutionSchema = new mongoose.Schema(
  {
    pid: {
      type: Number,
      required: true,
    },
    handlename: {
      type: String,
      required: true,
      trim: true,
    },
    language: {
      type: String,
      required: true,
      enum: ['C++', 'Python', 'JavaScript', 'Java', 'Other'],
    },
    approach: {
      type: String,
      required: true,
      maxlength: 1000
    },
    code: {
      type: String,
      required: true,
    },
    likes: {
        type: Number,
        default: 100
    }
  },
  { timestamps: true } 
);

module.exports = mongoose.model('Solution', solutionSchema);
