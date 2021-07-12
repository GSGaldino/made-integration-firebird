const app = require('../../app');
const firebirdController = require('./controllers');
const axios = require('axios');
require('dotenv').config();
const port = process.env.PORT || 3333;

// First start app with bling and fbits integrations
app.listen(port, () => console.log(`Update server listening on port: ${port} | REST`));

/**
 * Auto invoke async function to call
 * using npm management system e.g npm run update
 */
(async () => {
  // Inializing the service that read and create database if necessary
  await firebirdController.init();

  // Get local database in file database.json
  const localDatabase = await firebirdController.readDatabase();

  for (let i = 0; i < localDatabase.length; i++) {
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
        .catch(error => console.log(error.status));

    } catch (error) {
      throw error;
    }
  }

})();
