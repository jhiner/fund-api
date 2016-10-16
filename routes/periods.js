const express = require('express');
const router  = express.Router();
const getDb   = require('../lib/getDb');
const PERIOD_COLLECTION = require('../lib/constants.js').PERIOD_COLLECTION;

/*
(lookup)
fund_periods: {
    period_name: "Fall 2016",
    enabled: true
}
*/

/* GET periods */
router.get('/', function(req, res, next) {
      const query = {};

      getDb(function (db) {
        db.collection(PERIOD_COLLECTION).find(query).toArray(function (err, items) {
            res.json(items);  
        });
      });
});

/* UPDATE period */
router.put('/', function(req, res) {

    // TODO: Validate input
    var periodName = req.body.periodName;
    var newPeriodName = req.body.newPeriodName;

    const query = {
        periodName: periodName
    }

    const newRec = {
        periodName: newPeriodName
    }

    // update this period
      getDb(function (db) {
        db.collection(PERIOD_COLLECTION).updateOne(query, newRec, {}, function (err) {
            if (err) return res.status(500).json({error: err});
            res.status(200).json(newRec);
        });
      });
});

/* DELETE period */
router.delete('/', function(req, res) {

    // TODO: Validate input
    var periodName = req.body.periodName;

    // delete this period
    getDb(function (db) {
      db.collection(PERIOD_COLLECTION).remove({
       periodName: periodName
      }, function (err) {
        if (err) return res.status(500).json({error: err});
        res.status(204).json({});
      });
    });
});

/* POST periods */
router.post('/', function(req, res, next) {

    // TODO: validate input
    var periodName = req.body.periodName;

    if (!periodName || periodName === '') {
        return res.status(400).json({error: 'period is required'});
    }

    var period = {
        periodName: periodName,
        enabled: true
    }

    // insert new period
      getDb(function (db) {
        db.collection(PERIOD_COLLECTION).insert(period, function (err) {
          if (err && err.code === 11000) {
              winston.debug('period already exists', period);
          } else if (err) {
              return res.json({error: 'Period already exists'});
          } else {
            if (err) return res.json({error: err});
            return res.status(201).json({ message: 'Period added'});
          }
        });
      });
});

module.exports = router;
