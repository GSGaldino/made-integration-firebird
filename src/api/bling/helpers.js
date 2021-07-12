const fbitsController = require('../fbits/controllers');
require('dotenv').config();

module.exports = {
  async getUrls(sku) {
    try {

      const response = await fbitsController.getimages(sku);
      return response;

    } catch (error) { console.log(error) }
  },

  async calculateBlingStock(produto) {
    const estoque_reservado_01 =  produto.estoque_reservado_01 || 0;
    const estoque_reservado_02 =  produto.estoque_reservado_02 || 0;
    const estoque_reservado_08 =  produto.estoque_reservado_08 || 0;
    const toRemove = 
      Number(produto.estoqueminweb) + 
      estoque_reservado_01 +
      estoque_reservado_02 +
      estoque_reservado_08;

    const stock = (
      (Number(produto.estoque_disponivel_01) +
        Number(produto.estoque_disponivel_02) +
        Number(produto.estoque_disponivel_08)) - toRemove
    )

    return stock;
  }
};
