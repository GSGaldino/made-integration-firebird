const builder = require('xmlbuilder');
const axios = require('axios');
const helpers = require('./helpers');
require('dotenv').config();
require('url').URL;

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
          .then(product => res.send(product))

      } catch (error) {
        throw new Error("bling/:sku index() -> ", error)
      }
    }
  },
  async create(req, res) {
    const produto = req.body.produto || -1;
    if (produto) {
      const xml = builder.create('produto')

      try {

        xml.ele('codigo', produto.codigo)
        xml.ele('marca', produto.marca)
        xml.ele('gtin', produto.ean)
        xml.ele('descricao', produto.desc_at)
        xml.ele('situacao', "Ativo")
        xml.ele('descricaoCurta', produto.descricao)
        xml.ele('descricaoComplementar', produto.descricao)
        xml.ele('un', 'Pc')
        xml.ele('vlr_unit', produto.preco_sugerido)
        xml.ele('peso_liq', produto.peso_cub)
        xml.ele('altura', produto.altura)
        xml.ele('largura', produto.largura)
        xml.ele('profundidade', produto.prof)
        xml.ele('class_fiscal', produto.class_fiscal)
        xml.ele('origem', produto.trib_a)
        xml.ele('estoque', (Number(produto.estoque_disponivel_01) + Number(produto.estoque_disponivel_02) + Number(produto.estoque_disponivel_08)))

        // Get fbits urls and append to main xml
        const imagesTag = xml.ele('imagens');
        const imagesUrls = await helpers.getUrls(produto.codigo);

        try {
          if (imagesUrls) {
            for (product of imagesUrls) {
              const imageUrl = new URL(product.url);
              const encoded = `${imageUrl.origin}${imageUrl.pathname}`;

              function fixedEncodeURI(str) {
                return encodeURI(str).replace(/%5B/g, '[').replace(/%5D/g, ']');
              }

              imagesTag.ele('url', fixedEncodeURI(encoded));
            };
          }

        } catch (error) {
          throw error;
        }
        imagesTag.end()

        xml.end({ pretty: true })

        // Send API requisition to Bling
        await axios
          .post(`https://bling.com.br/Api/v2/produto/json?apikey=${process.env.BLING_API_KEY}&xml=${xml}`, {
            headers: {
              'Content-Type': 'application/json',
            }
          })
          .catch(error => {
            throw error
          })
          .then(response => {
            if (response.data.retorno.erros) {
              const errorsObject = response.data.retorno.erros;
              errorsObject.forEach(error => {
                console.log("Erro:", error)
              })

              // If had an error, send object returned by bling API
              return res.send(errorsObject);
            }

            res.send(response.data);
          })

      } catch (error) {
        console.log(error);
      }

    }
  }

};
