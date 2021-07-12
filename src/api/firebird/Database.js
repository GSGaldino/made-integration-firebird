const fs = require('fs');
const services = require('./services');
const helpers = require('./helpers');

class Database {
  constructor() {
    this._DATABASE_PATH = "database.json";
    this._config = { encoding: 'utf-8', flag: 'r' };
  }

  get data() {
    return this._data;
  }

  async new() {
    // Update data with firebird products
    const data = await services.getProducts();

    // Write local file
    fs.writeFileSync(this._DATABASE_PATH, JSON.stringify(data), 'utf-8', (err, content) => {
      if (err) console.log(err);
    })

    helpers.updateLastUpdateFile();
  }

  async read() {
    try {
      // Read local database and return it parsed
      const data = fs.readFileSync(this._DATABASE_PATH, this._config);
      return JSON.parse(data);
    } catch (error) {
      console.log("Database load error", "helpers.readLocalDatabase()");
      return this.new();
    }
  }

  getUpdates({ oldDatabase, newDatabase }) {
    // Initial array with database updates
    const databaseUpdates = {};

    // Get new products by intersection between arrays
    databaseUpdates.newProducts = newDatabase.filter(product => !oldDatabase.some(oldProduct => {
      return oldProduct.codigo === product.codigo
    }));

    // Get the length of new products
    databaseUpdates.productsLength = databaseUpdates.newProducts.length;

    return databaseUpdates;
  }

  addProducts(products) {
    try {
      fs.readFile(this._DATABASE_PATH, this._config, async (err, content) => {
  
        // Converts data to JSON and append new products
        const data = JSON.parse(content).concat(products);
        
        // Write new data to local file
        fs.writeFile(this._DATABASE_PATH, JSON.stringify(data), 'utf-8', (error, newContent) => {
          if (error) { console.log(error) };
        })
  
        // Update log file
        helpers.updateLastUpdateFile();
  
      })
    } catch (error) {
      throw error
    }
  }

  updateProduct(product) {
    try {
      fs.readFile(this._DATABASE_PATH, this._config, async (err, content) => {
  
        // Converts data to JSON and append new products
        const data = JSON.parse(content);

        // Update product on local database
        data.forEach((oldProduct, index) => {
          if (oldProduct.codigo === product.codigo) {
            data[index] = product;
          }
        })
        
        // Write new data to local file
        fs.writeFile(this._DATABASE_PATH, JSON.stringify(data), 'utf-8', (error, newContent) => {
          if (error) { console.log(error) };
        })
  
        // Update log file
        helpers.updateLastUpdateFile();
  
      })
    } catch (error) {
      throw error
    }
  }

  alreadyExists() {
    // Returns a boolean value that is true if database.json exists
    return fs.existsSync(this._DATABASE_PATH);
  }

};

module.exports = Database;
