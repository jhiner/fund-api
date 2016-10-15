var express = require('express');
var router = express.Router();

/* GET goals */
router.get('/', function(req, res, next) {
  res.json({ response: 'goals ok'});
});

module.exports = router;
