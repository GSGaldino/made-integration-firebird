const router = require("express").Router();
const blingController = require('./controllers');

router.get('/:sku', blingController.index);
router.post('/', blingController.create);

module.exports = router;
