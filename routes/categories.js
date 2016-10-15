const express = require('express');
const router  = express.Router();
const getDb   = require('../lib/getDb');
const CATEGORY_COLLECTION = require('../lib/constants.js').CATEGORY_COLLECTION;

/* GET categories */
router.get('/', function(req, res, next) {
    // connections.get = function(clientID, query, callback){
      // if (typeof query === 'function') {
      //   callback = query;
      //   query = {};
      // }

      const query = {};
      // query.client_id = clientID;

      getDb(function (db) {
        db.collection(CATEGORY_COLLECTION).find(query).toArray(function (err, items) {
            res.json(items);  
        });
      });
});

/* UPDATE category */
router.patch('/', function(req, res) {

    // TODO: Validate input
    var categoryName = req.body.categoryName;
    var newCategoryName = req.body.newCategoryName;

    const query = {
        categoryName: categoryName
    }

    const newRec = {
        categoryName: newCategoryName
    }

    // update this category
      getDb(function (db) {
        db.collection(CATEGORY_COLLECTION).updateOne(query, newRec, {}, function (err) {
            if (err) return res.status(500).json({error: err});
            res.status(200).json(newRec);
        });
      });
});

/* DELETE category */
router.delete('/', function(req, res) {

    // TODO: Validate input
    var categoryName = req.body.categoryName;

    // delete this category
    getDb(function (db) {
      db.collection(CATEGORY_COLLECTION).findOneAndDelete({
       categoryName: categoryName
      }, function (err) {
        if (err) return res.status(500).json({error: err});
        res.status(204).json({});
      });
    });
});

/* POST categories */
router.post('/', function(req, res, next) {

    // TODO: validate input
    var categoryName = req.body.categoryName;

    if (!categoryName || categoryName === '') {
        return res.status(400).json({error: 'category is required'});
    }

    var category = {
        categoryName: categoryName,
        enabled: true
    }

    // insert new category
      getDb(function (db) {
        db.collection(CATEGORY_COLLECTION).insert(category, function (err) {
          if (err && err.code === 11000) {
              winston.debug('category already exists', category);
          } else if (err) {
              return res.json({error: 'Category already exists'});
          } else {
            if (err) return res.json({error: err});
            return res.status(201).json({ message: 'Category added'});
          }
        });
      });
});

module.exports = router;
