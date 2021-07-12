const Database = require('./Database');
const helpers = require('./helpers');
require('dotenv').config();

const database = new Database();

/* A função init se responsabiliza por garantir que o arquivo database.json exista, estando ele corrompido ou não */
async function init() {
  console.log('===================================================');
  console.log("Initializing firebird integration tool:", "firebird/init()");

  // Get boolean that verify if database.json archive already exists
  const databaseExists = database.alreadyExists();
  console.log('===================================================');
  console.log("Database exists:", databaseExists);

  if (!databaseExists) {
    // Create new local database
    await database.new();
    console.log('===================================================');
    console.log("Success created local database");
  };

}

async function readDatabase() {
  console.log('===================================================');
  console.log("Reading database ...");

  // Read database if already have it
  const data = await database.read();

  console.log("database.length:", data && data.length);
  return data;
}

async function updateDatabase(oldDatabase, newDatabase) {

  const updates = await database.getUpdates({
    oldDatabase: oldDatabase,
    newDatabase: newDatabase
  });

  if (updates.newProducts && updates.productsLength && updates.productsLength > 0) {

    // Append new products to local database
    console.log('===================================================');
    console.log("Appending", updates.productsLength, "products to local database")

    database.addProducts(updates.newProducts);

    // async call to bling API with new products
    console.log("Appending", updates.productsLength, "products bling database")
    try {
      helpers.addProductsToBling(updates.newProducts);
    } catch (error) {
      throw error;
    }

  } else if (!updates.haveNewProducts) {
    console.log('===================================================');
    console.log("No updates available");
  }

}

async function updateProduct(product) {
  return await database.updateProduct(product);
};

module.exports = { init, readDatabase, updateDatabase, updateProduct };
