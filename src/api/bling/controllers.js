const builder = require('xmlbuilder');
const axios = require('axios');
require('dotenv').config();

module.exports = {

  async index(req, res) {
    const sku = req.params.sku || null;
    if (sku) {
      try {
        axios
          .get(`https://bling.com.br/Api/v2/produto/${sku}/json?apikey=${process.env.BLING_API_KEY}`, {
            headers: {
              'Content-Type': 'application/json',
            }
          })
          .catch(error => {
            throw new Error("bling/:sku index() ->", error)
          })
          .then(response => response.data.retorno.produtos)
          .then(product => {
            res.send(product)
          })
      } catch (error) {
        throw new Error("bling/:sku index() -> ", error)
      }
    }
  },
  async create(req, res) {
    const produto = req.body || -1;
    if (produto) {
      const xml = builder.create('produto')
      xml.ele('codigo', produto.codigo)
      xml.ele('descricao', produto.desc_at)
      xml.ele('situacao', "Ativo")
      xml.ele('descricaoCurta', produto.descricaocurta)
      xml.ele('descricaoComplementar', produto.descricaocurta)
      xml.ele('un', 'Pc')
      xml.ele('vlr_unit', produto.preco_sugerido)
      xml.ele('preco_custo', '1.23')
      xml.ele('peso_bruto', '0.2')
      xml.ele('peso_liq', produto.peso_cub)
      xml.ele('altura', produto.altura)
      xml.ele('largura', produto.largura)
      xml.ele('profundidade', produto.prof)
      xml.ele('class_fiscal', produto.class_fiscal)
      xml.ele('origem', produto.trib_a)
      xml.ele('estoque', produto.estoque_disponivel_02 + produto.estoque_disponivel_08)
      xml.ele('imagens')
        .ele('url', produto.url_imagem_web)
      .end()
      xml.end({ pretty: true })

      try {
        axios
          .post(`https://bling.com.br/Api/v2/produto/json?apikey=${process.env.BLING_API_KEY}&xml=${xml}`, {
            headers: {
              'Content-Type': 'application/json',
            }
          })
          .catch(error => {
            throw new Error("bling/:sku create() ->", error)
          })
          .then(response => {
            const produtos = response.data.retorno.produtos;
            console.log(produtos);

            res.send(produtos);
          })

      } catch (error) {
        throw new Error("bling/:sku create() -> ", error)
      }

    }
  }

};
