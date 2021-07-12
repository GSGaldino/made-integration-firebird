const router = require('express').Router();
const helpers = require('./helpers');
const blingHelpers = require('../bling/helpers');
const services = require('./services');

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


  // If we have both, run update 
  if (localDatabase && newDatabase) {
    await firebirdController.updateDatabase(localDatabase, newDatabase);

    // Loop through arrays and search for objects specifics differences
    console.log("Searching for price or stock updates ...");

    localDatabase.forEach((oldProduct) => {
      newDatabase.forEach(async newProduct => {

        // Take the mirror product
        if (oldProduct.codigo === newProduct.codigo) {

          // Calcula os estoques
          const estoqueAntigo = await blingHelpers.calculateBlingStock(oldProduct);
          const estoqueNovo = await blingHelpers.calculateBlingStock(newProduct);

          // Get the differences booleans
          const isPriceDifferent = oldProduct.preco_sugerido !== newProduct.preco_sugerido;
          const isEstoqueDifferent = estoqueNovo !== estoqueAntigo;

          // Caso haja alteração de preço ou estoque
          if (isPriceDifferent || isEstoqueDifferent) {
            try {
              await firebirdController.updateProduct(newProduct);
              await helpers.addProductsToBling([newProduct]);
            } catch (error) {
              throw error;
            }
          };

        };
      })
    })
  }

  // Aways log lastest update for better management
  console.log("Last update:", (await helpers.getLastUpdate()));
  console.log("Verification date:", (await helpers.getTime()));
};

// Looper and update logger
/* const fiveMinutesInMilliseconds = 10000;
setInterval(async () => {
  databaseUpdateLooper();
}, fiveMinutesInMilliseconds); */

databaseUpdateLooper();

module.exports = router;
