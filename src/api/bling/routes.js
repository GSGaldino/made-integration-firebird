const router = require("express").Router();

router.get("/", (req, res) => {
  res.json({
    message: "Default bling route."
  })
})

module.exports = router;
