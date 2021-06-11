const axios = require('axios');
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
      throw new Error("fbits/getImages() -> ", error);
    }
  }
}
