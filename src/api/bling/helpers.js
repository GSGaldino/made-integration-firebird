const fbitsController = require('../fbits/controllers');
require('dotenv').config();

module.exports = {
  async getUrls(sku) {
    try {

      const response = await fbitsController.getimages(sku);
      return response;

    } catch (error) {console.log(error)}
  }
};
