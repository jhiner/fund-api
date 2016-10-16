//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const should = chai.should();
const expect = chai.expect;
const getDb  = require('../lib/getDb');
const PERIOD_COLLECTION = require('../lib/constants.js').PERIOD_COLLECTION;


chai.use(chaiHttp);

/* Period tests */
describe('Periods', () => {
    beforeEach((done) => { //Before each test we empty the database
      getDb(function (db) {
        db.collection(PERIOD_COLLECTION).remove({}, function (err) {
          done();
        });
      });    
    });
 /*
  * Test the /GET route
  */
  describe('/GET periods', () => {
      it('it should GET all the periods', (done) => {
        chai.request(server)
            .get('/api/periods')
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
  describe('/POST period', () => {
      it('it should not POST a period without the period field', (done) => {
        const cat = {
            asdf: 'New Cat'
        }
        chai.request(server)
            .post('/api/periods')
            .send(cat)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('error').eql('period is required');
                // res.body.error.should.have.property('pages');
                // res.body.errors.pages.should.have.property('kind').eql('required');
              done();
            });
      });

      it('it should POST a period ', (done) => {
        const cat = {
            periodName: 'Testing'
        }
        chai.request(server)
            .post('/api/periods')
            .send(cat)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Period added');
                // res.body.book.should.have.property('title');
                // res.body.book.should.have.property('author');
                // res.body.book.should.have.property('pages');
                // res.body.book.should.have.property('year');
              done();
            });
      });

  });

/*
Test PUT endpoint
*/
  describe('/PUT period', () => {

          it('it should UPDATE a period ', (done) => {

        const record = {
            periodName: 'Testing'
        }

        const newRecord = {
            periodName: 'Testing',
            newPeriodName: 'NewTesting'
        }

        getDb(function (db) {
          // create the original period, then update it
          db.collection(PERIOD_COLLECTION).insert(record, function (err) {
          chai.request(server)
              .put('/api/periods')
              .send(newRecord)
              .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('periodName').eql(newRecord.newPeriodName);
                  done();
              });
          });
        }); 

      });
  });


/* 
Test DELETE endpoint
*/
  describe('/DELETE period', () => {

      it('it should DELETE a period ', (done) => {

        const cat = {
            periodName: 'Testing123'
        }


        getDb(function (db) {
          // create the original period, then delete it
          db.collection(PERIOD_COLLECTION).insert(cat, function (err) {
          
          // invoke API to delete
          chai.request(server)
              .delete('/api/periods')
              .send(cat)
              .end((err, res) => {
                  res.should.have.status(204);
                  res.body.should.be.a('object');

                // check it's not there
                chai.request(server)
                    .get('/api/periods')
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