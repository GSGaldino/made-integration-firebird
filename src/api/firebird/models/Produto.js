class Produto {
  constructor(database_row) {

  this.codigo = database_row["PRODUTO"] ? database_row["PRODUTO"].toString() : null,
  this.descricao = database_row["DESCRICAO"] ? database_row["DESCRICAO"].toString() : null,
  this.desc_at = database_row["DESC_AT"] ? database_row["DESC_AT"].toString() : null,
  this.trib_a = database_row["TRIB_A"] ? database_row["TRIB_A"].toString() : null,
  this.class_fiscal =
    database_row["CLASS_FISCAL"]
      ? database_row["CLASS_FISCAL"].toString()
      : null,
  this.peso = database_row["PESO"] ? database_row["PESO"] : null,
  this.largura = database_row["LARGURA"] ? database_row["LARGURA"] : null,
  this.altura = database_row["ALTURA"] ? database_row["ALTURA"] : null,
  this.prof = database_row["PROF"] ? database_row["PROF"] : null,
  this.origem = database_row["ORIGEM"] ? database_row["ORIGEM"].toString() : null,
  this.potencia = database_row["POTENCIA"] ? database_row["POTENCIA"] : null,
  this.detalhes = database_row["DETALHES"] ? database_row["DETALHES"] : null,
  this.datamodificacao = database_row["DATAMODIFICACAO"] ? database_row["DATAMODIFICACAO"] : null,
  this.palavrachave =
    database_row["PALAVRACHAVE"]
      ? database_row["PALAVRACHAVE"].toString()
      : null,
  this.descricaocurta =
    database_row["DESCRICAOCURTA"]
      ? database_row["DESCRICAOCURTA"].toString()
      : null,
  this.descricaolonga = database_row["DESCRICAOLONGA"] ? database_row["DESCRICAOLONGA"] : null,
  this.estoqueminweb = database_row["ESTOQUEMINWEB"] ? database_row["ESTOQUEMINWEB"] : null,
  this.precopromocaoweb = database_row["PRECOPROMOCAOWEB"] ? database_row["PRECOPROMOCAOWEB"] : null
  this.datainiprecopromocaoweb =
    database_row["DATAINIPRECOPROMOCAOWEB"]
      ? database_row["DATAINIPRECOPROMOCAOWEB"]
      : null,
  this.datafimprecopromocaoweb =
    database_row["DATAFIMPRECOPROMOCAOWEB"]
      ? database_row["DATAFIMPRECOPROMOCAOWEB"]
      : null,
  this.estoque_disponivel_01 =
    database_row["ESTOQUE_DISPONIVEL_01"]
      ? database_row["ESTOQUE_DISPONIVEL_01"]
      : null,
  this.estoque_disponivel_02 =
    database_row["ESTOQUE_DISPONIVEL_02"]
      ? database_row["ESTOQUE_DISPONIVEL_02"]
      : null,
  this.estoque_disponivel_08 =
    database_row["ESTOQUE_DISPONIVEL_08"]
      ? database_row["ESTOQUE_DISPONIVEL_08"]
      : null
  this.cor_id = database_row["COR_ID"] ? database_row["COR_ID"] : null,
  this.preco_sugerido = database_row["PRECO_SUGERIDO"] ? database_row["PRECO_SUGERIDO"] : null,
  this.preco_internet = database_row["PRECO_INTERNET"] ? database_row["PRECO_INTERNET"] : null,
  this.peso_cub = database_row["PESO_CUB"] ? database_row["PESO_CUB"] : null,
  this.voltagem = database_row["VOLTAGEM"] ? database_row["VOLTAGEM"] : null,
  this.data_modificacao_cadastro =
    database_row["DATA_MODIFICACAO_CADASTRO"]
      ? database_row["DATA_MODIFICACAO_CADASTRO"]
      : null,
  this.url_imagem_web = 
    database_row["URL_IMAGEM_WEB"] 
      ? database_row["URL_IMAGEM_WEB"].toString() 
      : null,
  this.ativointernet = 
    database_row["ATIVOINTERNET"] 
      ? database_row["ATIVOINTERNET"].toString() 
      : null
  }
}

module.exports = Produto;
