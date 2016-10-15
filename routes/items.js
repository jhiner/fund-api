var express = require('express');
var router = express.Router();

/* GET items */
router.get('/', function(req, res, next) {
  res.json({ response: 'items ok'});
});

module.exports = router;
