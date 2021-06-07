const router = require('express').Router();
const helpers = require('./helpers');
const firebirdController = require('./controllers');

async function databaseUpdateLooper() {
  // Starting clearing console
  console.clear();
  
  // Inializing the controller service that read ( and / or ) create one
  firebirdController.init();

  // Update database, passing with parameter the old database
  const localDatabase = await firebirdController.readDatabase();
  await firebirdController.updateDatabase(localDatabase);

  // Aways log last update for better management
  console.log("Last update:", (await helpers.getLastUpdate()));
};

// Looper and update logger
const fiveMinutesInMilliseconds = 20000;
setInterval(async () => {
  databaseUpdateLooper();
}, fiveMinutesInMilliseconds);

module.exports = router;
