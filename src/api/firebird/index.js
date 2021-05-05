const Firebird = require("node-firebird");
const router = require("express").Router();

const Produto = require('./Produto');

let _DATABASE = [];

router.get("/", (req, res) => {
  res.send(_DATABASE);
})

var options = {
  host: 'madeinbrazil.no-ip.org',
  port: 3050,
  database: '/home/db/made_ib.fdb',
  user: 'SYSDBA',
  password: 'master',
  lowercase_keys: false,
  role: null,
  pageSize: 4096
};


Firebird.attach(options, function (err, db) {
  const query = process.env.QUERY || "select * from bproduto"
  if (err)
    throw err;

  // db = DATABASE
  db.query(query, function (err, result) {
    console.log(err)
    console.log(result)
    // IMPORTANT: close the connection
    db.detach();
  });

  db.on('row', function (row, index, isObject) {
    // index === Number
    // isObject === is row object or array?

    const produto = new Produto(row);
    _DATABASE.push(produto);
  });

});

module.exports = router;
