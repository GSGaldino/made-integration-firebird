const fs = require('fs');
const services = require('./services');
const helpers = require('./helpers');
const axios = require('axios');
require('dotenv').config();

/**
 * Index function that take database in the execution time
 * @param {ExpressRequisition} req the requisition object
 * @param {ExpressResponse} res response that will be back to the client
 * @returns {JSON} with all products and their descriptions
 */
/* async function index(req, res) {
  fs.readFile('database.json', (err, content) => {
    if (err)
      console.log(err)

    const data = JSON.parse(content);

    res
      .status(200)
      .json({
        database_length: data.length,
      })

  })
} */

async function init() {
  console.log('===================================================');
  console.log("Initializing firebird integration tool:", "firebird/init()");
  const databaseExists = await helpers.databaseExists();
  console.log('===================================================');
  console.log("Database exists:", databaseExists);

  if (!databaseExists) {
    console.log("You have not database yet");

    const data = await services.getProducts();
    helpers.createLocalDatabase(data);
  }

  console.log('===================================================');
  console.log("Reading database ...");

  fs.readFile('database.json', { encoding: 'utf-8', flag: 'r' }, async (err, content) => {
    if (err) {
      console.log('===================================================');
      console.log("Database load error", err);
    }

    const data = JSON.parse(content);

    console.log('===================================================');
    console.log("Success loaded database");
    console.log("database.length", data.length);

    /* const response = await axios.get(`http://localhost:${process.env.PORT || 3333}/api/bling/36474`);
    const produto = await response.data[0].produto; */

    // TODO create integration between bling and firebird to migrate all products to database
  });

}

module.exports = { init };
