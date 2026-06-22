const User = require('../models/usermodel');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Added a sample user initially

const newfunc= async () => {
  console.log("Adding sample user");

  const db = mongoose.connection;
  const collectionName = 'users';

  if (db.collections[collectionName]) {
    try {
      await db.dropCollection(collectionName);
      console.log(`Collection '${collectionName}' dropped successfully.`);
    } catch (err) {
      console.error(`Error dropping collection: ${err.message}`);
    }
  } else {
    console.log(`Collection '${collectionName}' does not exist.`);
  }
  const hashedPassword = await bcrypt.hash("Password@123", 10);
  const newUser = new User({
    handlename: "coder169",
    username: "Kameshwar",
    email: "coder@zcoder.dev",
    password: "hashedPassword", 
    description: "Frontend developer at ZCoder",
    bookmarks: [1]
  });

  const result = await newUser.save();
  console.log("User inserted");
};

module.exports = newfunc