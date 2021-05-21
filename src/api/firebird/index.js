const firebirdController = require('./controllers');
const router = require('express').Router();
const routes = require('./routes');

firebirdController.init();
router.use('/', routes);

module.exports = router;
