const mongoose = require('mongoose');

// Problem Schema

const exampleSchema = new mongoose.Schema({
  input: { 
    type: String, 
    required: true 
    },
  output: { 
    type: String, 
    required: true
    },
  explanation: { 
    type: String 
    }
},
{ _id: false });

const problemSchema = new mongoose.Schema({
  
  pid: { 
    type: Number, 
    unique: true, 
    required: true 
    },

  title: { 
    type: String, 
    required: true 
    },

  description: { 
    type: String, 
    required: true 
    },

  difficulty: { 
    type: String, 
    enum: ['Easy', 'Medium', 'Hard'], 
    required: true 
    },

  topics: [{ type: String }],

  solved: { 
    type: Number, 
    default: 100 
    },

  constraints: [{ type: String }],

  examples: [exampleSchema]

}, { timestamps: true });

module.exports = mongoose.model("Problem", problemSchema);