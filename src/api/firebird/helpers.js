const fs = require('fs');
const axios = require('axios');

const LAST_UPDATE_PATH = "last_update.timestamp.json";
const readConfig = { encoding: 'utf-8', flag: 'r' };

module.exports = {
  async addProductsToBling(products) {
    for (let i = 0; i < products.length; i++) {
      const produto = products[i];
      console.log('===================================================');
      console.log("Fetching bling API - create new product | codigo:", produto.codigo);
  
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

  async getLastUpdate() {

    try {
  
      // Get file content using file system
      const content = await fs.readFileSync(LAST_UPDATE_PATH, readConfig, (err, content) => {
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

  updateLastUpdateFile(){
    fs.writeFile(LAST_UPDATE_PATH, JSON.stringify(Date.now()), 'utf-8', (error, newContent) => {
      if (error) { console.log(error) };
    });
  },
  
  async sleep(ms) {
    return new Promise((resolve) => {
      console.log(`Sleeping ${ms} millisseconds`)
      setTimeout(resolve, ms);
    });
  }

};
