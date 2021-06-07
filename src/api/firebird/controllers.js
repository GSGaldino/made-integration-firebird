const fs = require('fs');
const services = require('./services');
const helpers = require('./helpers');
const axios = require('axios');
require('dotenv').config();

/* for (let i = 0; i <= data.length; i++) {
    const produto = data[i];
    console.log('===================================================');
    console.log("Fetching bling API - create new product | codigo:", data[i].codigo);

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

  } */

async function init() {
  console.log('===================================================');
  console.log("Initializing firebird integration tool:", "firebird/init()");

  // Get boolean that verify if database.json archive already exists
  const databaseExists = await helpers.databaseExists();
  console.log('===================================================');
  console.log("Database exists:", databaseExists);

  // Verify if database doesn't exists
  if (!databaseExists) {
    console.log("You have not database yet");

    // Get all products in firebird
    const data = await services.getProducts();

    // Create local database using file system
    await helpers.createLocalDatabase(data);
  }
}

async function readDatabase() {
  console.log('===================================================');
  console.log("Reading database ...");

  // Read database if already have it
  const data = await helpers.readLocalDatabase();

  console.log("database.length:", data && data.length);
  return await data;
}

async function updateDatabase(data) {

  const updates = await helpers.getDatabaseUpdates({
    oldDatabase: data,
    newDatabase: await services.getProducts()
  });

  if (updates.haveNewProducts) {
    console.log('===================================================');
    console.log("You have", updates.productsLength, "products available to update");

    // Append new products to local database
    helpers.addProductsToLocalDatabase(updates.newProducts);

    console.log("Appending", updates.productsLength, "products to local database")
  } else if (!updates.haveNewProducts) {
    console.log('===================================================');
    console.log("No updates available");
  }

}

module.exports = { init, readDatabase, updateDatabase };
