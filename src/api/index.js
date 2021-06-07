const router = require("express").Router();

const bling = require("./bling/routes");
const fbits = require('./fbits/routes');
const firebird = require("./firebird");

router.use("/bling", bling);
router.use("/fbits", fbits);
router.use("/firebird", firebird);

module.exports = router;
