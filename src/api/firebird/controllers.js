const fs = require('fs');
const services = require('./services');
const helpers = require('./helpers');
const axios = require('axios');
require('dotenv').config();

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

    for (let i = 0; i <= data.length; i++) {
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

    }

  });

}

module.exports = { init };
