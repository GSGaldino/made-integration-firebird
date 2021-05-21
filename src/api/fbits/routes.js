const router = require('express').Router();
const axios = require('axios');
const trayController = require('./controllers');

require('dotenv').config();

router.get('/:sku', async (req, res, next) => {
  if (req.params.sku) {
    try {
      const response = await trayController.getimages(String(req.params.sku));
      res.send(response);
    } catch (error) {
      res.send(error);
    }
  } else {
    res.status(400).json({ message: "missing parameter Sku: Number | String" })
    next(new Error("GET tray/:sku Missing param product"))
  }
})

module.exports = router;
