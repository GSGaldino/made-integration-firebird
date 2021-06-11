const router = require('express').Router();
const helpers = require('./helpers');
const services = require('./services');
const axios = require('axios');

const firebirdController = require('./controllers');

async function databaseUpdateLooper() {
  // Starting clearing console
  console.clear();

  // Inializing the service that read and create database if necessary
  await firebirdController.init();

  // Get local database in file database.json
  const localDatabase = await firebirdController.readDatabase();

  // Update database, passing with parameter the old and new database to compare 
  const newDatabase = await services.getProducts();
  await firebirdController.updateDatabase(localDatabase, newDatabase);

  // Aways log last update for better management
  console.log("Last update:", (await helpers.getLastUpdate()));
  console.log("Verification date:", (await helpers.getTimestamp()));

  for (let i = 0; i <= localDatabase.length; i++) {
    const produto = localDatabase[i];
    console.log('===================================================');
    console.log("Fetching bling API - create new product | codigo:", localDatabase[i].codigo);
    console.log("Updating", i + 1, "of", localDatabase.length, "products.");
    try {

      await axios.post(`${process.env.BACKEND_URL}:${process.env.PORT}/api/bling`, {
        headers: {
          'Content-Type': 'application/json'
        },
        produto,
      })
        .then(response => {
          console.log('===================================================');
          console.log("success registered product | id:", response.data.retorno.produtos[0].produto.id);
        })
        .catch(error => console.log(error))

    } catch (error) {
      throw error
    }
  }
};

// Looper and update logger
/* const fiveMinutesInMilliseconds = 300000;
setInterval(async () => {
  databaseUpdateLooper();
}, fiveMinutesInMilliseconds); */

databaseUpdateLooper();

module.exports = router;
