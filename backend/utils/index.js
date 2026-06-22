require("dotenv").config();
const mongoose = require("mongoose");

// import all your files
const addRooms = require("./addrooms");
const addMessages = require("./admessagetodb");
const seedProblems = require("./problemsinsertion");
const removeSolutions = require("./removesolutions");
const socketMessages = require("./socketmessages");
const socketUsers = require("./socketusers");
const insertSolutions = require("./solutioninsertion");
const seedUsers = require("./usersampleinsertion");

async function runAllData() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ MongoDB Connected");

    // 🔥 call each file
    await addRooms();
    await addMessages();
    await seedProblems();
    await removeSolutions();
    await socketMessages();
    await socketUsers();
    await insertSolutions();
    await seedUsers();

    console.log("🚀 ALL DATA INSERTED SUCCESSFULLY");
    process.exit();
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

runAllData();