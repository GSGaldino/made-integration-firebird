const fs = require('fs');
const axios = require('axios');

const DATABASE_PATH = "database.json";
const LAST_UPDATE_PATH = "last_update.timestamp.json";
const readConfig = { encoding: 'utf-8', flag: 'r' };

const updateLastUpdateFile = () => {
  fs.writeFile(LAST_UPDATE_PATH, JSON.stringify(Date.now()), 'utf-8', (error, newContent) => {
    if (error) { console.log(error) };
  });
};

module.exports = {
  async readLocalDatabase() {
    try {
      // Read local database and return it parsed
      return await JSON.parse(fs.readFileSync(DATABASE_PATH, readConfig));
    } catch (error) {
      console.log('===================================================');
      console.log("Database load error", "helpers.readLocalDatabase()");
    }
  },

  async createLocalDatabase(database) {
    fs.writeFileSync(DATABASE_PATH, JSON.stringify(database), 'utf-8', (err, content) => {
      console.log(err);
    })
    updateLastUpdateFile();
    console.log('===================================================');
    console.log("Success created local database:", database.length, "items");
  },

  async databaseExists() {
    return fs.existsSync(DATABASE_PATH);
  },

  async getDatabaseUpdates({ oldDatabase, newDatabase }) {
    // Initial array with database updates
    const databaseUpdates = {};

    // Get new products by intersection between arrays
    databaseUpdates.newProducts = newDatabase.filter(product => !oldDatabase.some(oldProduct => {
      return oldProduct.codigo === product.codigo
    }));

    // Get the length of new products
    databaseUpdates.productsLength = databaseUpdates.newProducts.length;

    return await databaseUpdates;
  },

  /**
   * Take new products and write into local database
   * @param {Array} newProducts Array of products that are prototype of Produto()
   */
  async addProductsToLocalDatabase(newProducts) {
    try {
      fs.readFile(DATABASE_PATH, readConfig, async (err, content) => {

        // Converts data to JSON and append new products
        const data = JSON.parse(content).concat(newProducts);

        fs.writeFile(DATABASE_PATH, JSON.stringify(data), 'utf-8', (error, newContent) => {
          if (error) { console.log(error) };

          console.log('===================================================');
          console.log("Success updated database:", newProducts.length, "new items");
        })

        // Update log file
        updateLastUpdateFile();

      })
    } catch (error) {
      throw error
    }
  },

  async updateLocaldatabaseProduct(product) {
    try {
      fs.readFile(DATABASE_PATH, readConfig, async (err, content) => {

        // Converts data to JSON and append new products
        const data = JSON.parse(content);

        // Update product on local database
        data.forEach((oldProduct, index) => {
          if (oldProduct.codigo === product.codigo) {
            data[index] = product;
          }
        })

        fs.writeFile(DATABASE_PATH, JSON.stringify(data), 'utf-8', (error, newContent) => {
          if (error) { console.log(error) };

          console.log('===================================================');
          console.log("Success updated product SKU:", product.codigo);
        })

        // Update log file
        updateLastUpdateFile();

      })
    } catch (error) {
      throw error
    }
  },

  async getLastUpdate() {

    try {

      // Get file content using file system
      const content = fs.readFileSync(LAST_UPDATE_PATH, readConfig, (err, content) => {
        if (err) throw err;
      });

      // Define a date with registered timestamp
      const date = new Date(JSON.parse(content));

      // Defining hour, minute and second on format 00:00:00
      const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

      // Defining date in format DD/MM/AAAA
      const formattedDate = `${date.getDate()}/${(date.getMonth() + 1)}/${date.getFullYear()}`;

      return `${formattedDate} - ${time}`;

    } catch (error) {
      throw error;
    }
  },

  async getTime() {

    try {

      // Create new date object on execition-time
      const date = new Date();

      // Defining hour, minute and second on format 00:00:00
      const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

      // Defining date in format DD/MM/AAAA
      const formattedDate = `${date.getDate()}/${(date.getMonth() + 1)}/${date.getFullYear()}`;

      return `${formattedDate} - ${time}`;

    } catch (error) {
      throw error;
    }
  },

  async addProductsToBling(products) {
    for (let i = 0; i < products.length; i++) {
      const produto = products[i];
      console.log('===================================================');
      console.log("Fetching bling API - create new product | codigo:", produto.codigo);
      console.log("Adicionando", i + 1, "de", products.length, "produtos.");

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
  },

  async sleep(ms) {
    return new Promise((resolve) => {
      console.log(`Sleeping ${ms} millisseconds`)
      setTimeout(resolve, ms);
    });
  }

}
