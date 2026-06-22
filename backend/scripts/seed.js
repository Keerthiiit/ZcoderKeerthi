require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = require('../config/db');
const addProblems = require('../utils/problemsinsertion');
const addRooms = require('../utils/addrooms');
const addSolutions = require('../utils/solutioninsertion');
const addSampleUser = require('../utils/usersampleinsertion');

const seeders = {
  problems: addProblems,
  rooms: addRooms,
  solutions: addSolutions,
  users: addSampleUser,
};

const DEFAULT_SEED_ORDER = ['problems', 'rooms', 'users', 'solutions'];

const parseTargets = () => {
  const requested = process.argv.slice(2).map((target) => target.toLowerCase());

  if (requested.length === 0 || requested.includes('all')) {
    return DEFAULT_SEED_ORDER;
  }

  const invalidTargets = requested.filter((target) => !seeders[target]);
  if (invalidTargets.length > 0) {
    throw new Error(
      `Unknown seed target(s): ${invalidTargets.join(', ')}. Valid targets: all, ${Object.keys(seeders).join(', ')}`
    );
  }

  return requested;
};

const runSeed = async () => {
  if (!process.env.MONGO_URL) {
    throw new Error('Missing required environment variable: MONGO_URL');
  }

  const targets = parseTargets();
  await connectDB();

  for (const target of targets) {
    console.log(`\nSeeding ${target}...`);
    await seeders[target]();
  }

  console.log('\nDatabase seed completed successfully.');
};

runSeed()
  .catch((error) => {
    console.error('Database seed failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });