const fs = require('fs');
const services = require('./services');
const helpers = require('./helpers');
const axios = require('axios');
require('dotenv').config();

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

async function updateDatabase(oldDatabase, newDatabase) {

  const updates = await helpers.getDatabaseUpdates({
    oldDatabase: oldDatabase,
    newDatabase: newDatabase
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
