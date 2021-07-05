const axios = require('axios');
const helpers = require('../firebird/helpers');
require('dotenv').config();

module.exports = {

  async getimages(sku) {

    try {
      const response = await axios.get(`http://api.fbits.net/produtos/${sku}/imagens?tipoIdentificador=Sku`, {
        method: "get",
        headers: {
          'Authorization': `Basic ${process.env.FBITS_API_KEY}`
        }
      })
      return response.data;
    } catch (error) {

      // Exced API limit (120 per minute)
      if(error.response.status === 429){
        await helpers.sleep(60000)
        getimages(sku);
      };

    };

  }

}
