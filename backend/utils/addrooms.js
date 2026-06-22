const mongoose = require('mongoose');
const Room = require('../models/roomsmodel');

// Add new rooms using this
const mockRooms = [
            {
              id: 1,
              name: 'JavaScript Beginners',
              description: 'Learn JavaScript fundamentals together',
              topic: 'JavaScript',
              participants: 12
            },
            {
              id: 2,
              name: 'DP Study Group',
              description: 'Learn and discuss DP Patterns',
              topic: 'Dynamic Programming',
              participants: 8
            },
            {
              id: 3,
              name: 'Algorithm Challenges',
              description: 'Solve DSA problems collaboratively',
              topic: 'Algorithms',
              participants: 15
            },
            {
              id: 4,
              name: 'React Interview Prep',
              description: 'Discuss Frontend architectures using react.js',
              topic: 'Frontend',
              participants: 6
            },
            {
              id: 5,
              name: 'Python for Data Science',
              description: 'Pandas, NumPy, and ML basics',
              topic: 'Python',
              participants: 10
            },
            {
              id: 6,
              name: 'Web Development Q&A',
              description: 'Get help with your web projects',
              topic: 'Web Development',
              participants: 18
            }

];




const addrooms= async () => {

  console.log("Adding rooms");

  const db = mongoose.connection;
  const collectionName = 'rooms';

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

  await Room.insertMany(mockRooms);

  console.log("Rooms inserted successfully");
  
};

module.exports = addrooms