//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const should = chai.should();
const expect = chai.expect;
const getDb  = require('../lib/getDb');
const CATEGORY_COLLECTION = require('../lib/constants.js').CATEGORY_COLLECTION;


chai.use(chaiHttp);

/* Category tests */
describe('Categories', () => {
    beforeEach((done) => { //Before each test we empty the database
      getDb(function (db) {
        db.collection(CATEGORY_COLLECTION).remove({}, function (err) {
          done();
        });
      });    
    });
 /*
  * Test the /GET route
  */
  describe('/GET categories', () => {
      it('it should GET all the categories', (done) => {
        chai.request(server)
            .get('/api/categories')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
              done();
            });
      });
  });

 /*
  * Test the /POST route
  */
  describe('/POST category', () => {
      it('it should not POST a category without the category field', (done) => {
        const cat = {
            asdf: 'New Cat'
        }
        chai.request(server)
            .post('/api/categories')
            .send(cat)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('error').eql('category is required');
                // res.body.error.should.have.property('pages');
                // res.body.errors.pages.should.have.property('kind').eql('required');
              done();
            });
      });

      it('it should POST a category ', (done) => {
        const cat = {
            categoryName: 'Testing'
        }
        chai.request(server)
            .post('/api/categories')
            .send(cat)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Category added');
                // res.body.book.should.have.property('title');
                // res.body.book.should.have.property('author');
                // res.body.book.should.have.property('pages');
                // res.body.book.should.have.property('year');
              done();
            });
      });

  });

/*
Test PATCH endpoint
*/
  describe('/PATCH category', () => {

          it('it should UPDATE a category ', (done) => {

        const cat = {
            categoryName: 'Testing'
        }

        const newCat = {
            categoryName: 'Testing',
            newCategoryName: 'NewTesting'
        }

        getDb(function (db) {
          // create the original category, then update it
          db.collection(CATEGORY_COLLECTION).insert(cat, function (err) {
          chai.request(server)
              .patch('/api/categories')
              .send(newCat)
              .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('categoryName').eql(newCat.newCategoryName);
                  done();
              });
          });
        }); 

      });
  });


/* 
Test DELETE endpoint
*/
  describe('/DELETE category', () => {

      it('it should DELETE a category ', (done) => {

        const cat = {
            categoryName: 'Testing123'
        }


        getDb(function (db) {
          // create the original category, then delete it
          db.collection(CATEGORY_COLLECTION).insert(cat, function (err) {
          
          // invoke API to delete
          chai.request(server)
              .delete('/api/categories')
              .send(cat)
              .end((err, res) => {
                  res.should.have.status(204);
                  res.body.should.be.a('object');

                // check it's not there
                chai.request(server)
                    .get('/api/categories')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        res.body.length.should.be.eql(0);
                      done();
                    });
              });
          });


        }); 

      });
    });

});