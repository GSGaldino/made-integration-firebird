const router = require("express").Router();

const firebird = require("./firebird");
const bling = require("./bling/routes");
const fbits = require('./fbits/routes');

router.use("/bling", bling);
router.use("/fbits", fbits);
router.use("/firebird", firebird);

module.exports = router;
