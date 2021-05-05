const router = require("express").Router();
const bling = require("./bling/routes");
const firebird = require("./firebird");

router.use("/bling", bling);
router.use("/firebird", firebird);

module.exports = router;
