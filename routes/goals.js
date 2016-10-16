const express = require('express');
const router  = express.Router();
const getDb   = require('../lib/getDb');
const GOAL_COLLECTION = require('../lib/constants.js').GOAL_COLLECTION;

/*
fund_goals: {
    user: "hinerman@gmail.com",
    period: "Fall 2016",
    goalAmount: 100.00
}
*/

/* GET goals */
router.get('/', function(req, res) {
      const query = {};

      getDb(function (db) {
        db.collection(GOAL_COLLECTION).find(query).toArray(function (err, items) {
            res.json(items);  
        });
      });
});

/* GET single goal */
router.get('/:id', function(req, res) {
      const query = { _id: req.query.id};

      getDb(function (db) {
        db.collection(GOAL_COLLECTION).findOne(query, {}, function (err, result) {
          if (err) return res.status(500).json({error: err});
          if (result) {
            // we got a result
            return res.status(200).json(result);
          } else {
            res.status(404).json({});
          }
        });
      });
});


/* UPDATE goal */
router.put('/', function(req, res) {

    // TODO: validate input
    var goalId = req.body.id;
    var newGoalAmount = req.body.goalAmount;
    var newPeriod = req.body.period;
    var newUser = req.body.user;

    const query = {
        _id: goalId
    };

    var newRec = {
      user: newUser, 
      goalAmount: newGoalAmount,
      period: newPeriod
    };

    // update this goal
      getDb(function (db) {
        db.collection(GOAL_COLLECTION).updateOne(query, newRec, {}, function (err) {
            if (err) return res.status(500).json({error: err});
            newRec.id = goalId;
            res.status(200).json(newRec);
        });
      });
});

/* DELETE goal */
router.delete('/', function(req, res) {

    // TODO: Validate input
    var goalId = req.body.id;

    // delete this goal
    getDb(function (db) {
      db.collection(GOAL_COLLECTION).remove({
       _id: goalId
      }, function (err) {
        if (err) return res.status(500).json({error: err});
        res.status(204).json({});
      });
    });
});

/* POST goals */
router.post('/', function(req, res) {

    // TODO: validate input
    var goalAmount = req.body.goalAmount;
    var period = req.body.period;
    var user = req.body.user;

    if (!goalAmount || goalAmount === '') {
        return res.status(400).json({error: 'goalAmount is required'});
    }

    if (!period || period === '') {
        return res.status(400).json({error: 'period is required'});
    }

    if (!user || user === '') {
        return res.status(400).json({error: 'user is required'});
    }

    var goal = {
        user: user,
        period: period,
        goalAmount: goalAmount
    }

    // insert new goal
      getDb(function (db) {
        db.collection(GOAL_COLLECTION).insert(goal, function (err, result) {
          if (err && err.code === 11000) {
              winston.debug('Goal already exists', goal);
          } else {
            if (err) return res.json({error: err});
            goal.id = result.insertedIds[0];
            return res.status(201).json({ goal: goal });
          }
        });
      });
});

module.exports = router;
