const router = require('express').Router();
const helpers = require('./helpers');
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
  await firebirdController.updateDatabase(localDatabase, newDatabase);

  // Loop through arrays and search for objects specifics differences
  console.log("Searching for price or stock updates ...");
  localDatabase.forEach((oldProduct) => {
    newDatabase.forEach(async newProduct => {

      // Take the mirror product
      if (oldProduct.codigo === newProduct.codigo){

        // Calcula os estoques
        const estoqueAntigo = Number(oldProduct.estoque_disponivel_01) + Number(oldProduct.estoque_disponivel_02) + Number(oldProduct.estoque_disponivel_08);
        const estoqueNovo = Number(newProduct.estoque_disponivel_01) + Number(newProduct.estoque_disponivel_02) + Number(newProduct.estoque_disponivel_08);
        
        // Get the differences booleans
        const isPriceDifferent = oldProduct.preco_sugerido !== newProduct.preco_sugerido;
        const isEstoqueDifferent = estoqueNovo !== estoqueAntigo;

        if(isPriceDifferent || isEstoqueDifferent) {
          try {
            await helpers.updateLocaldatabaseProduct(newProduct);
            await helpers.addProductsToBling([newProduct]);
          } catch (error) {
            throw error;
          }
        };

      };
    })
  })  

  // Aways log lastest update for better management
  console.log("Last update:", (await helpers.getLastUpdate()));
  console.log("Verification date:", (await helpers.getTime()));
};

// Looper and update logger
const fiveMinutesInMilliseconds = 300000;
setInterval(async () => {
  databaseUpdateLooper();
}, fiveMinutesInMilliseconds);

module.exports = router;
