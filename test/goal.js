//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const should = chai.should();
const expect = chai.expect;
const getDb  = require('../lib/getDb');
const GOAL_COLLECTION = require('../lib/constants.js').GOAL_COLLECTION;


chai.use(chaiHttp);

/* Goal tests */
describe('Goals', () => {
    beforeEach((done) => { //Before each test we empty the database
      getDb(function (db) {
        db.collection(GOAL_COLLECTION).remove({}, function (err) {
          done();
        });
      });    
    });
 /*
  * Test the /GET route
  */
  describe('/GET goals', () => {
      it('it should GET all the goals', (done) => {
        chai.request(server)
            .get('/api/goals')
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
  describe('/POST goal', () => {

      it('it should not POST a goal without the period field', (done) => {
        var rec = {
            user: 'user@domain.com',
            goalAmount: 100.50
        }
        chai.request(server)
            .post('/api/goals')
            .send(rec)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('error').eql('period is required');
              done();
            });
      });

      it('it should POST a goal ', (done) => {
        var rec = {
            user: 'user@domain.com',
            period: '2015-2016',
            goalAmount: 100.50
        }
        chai.request(server)
            .post('/api/goals')
            .send(rec)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('goal');
                res.body.goal.should.have.property('id');
                res.body.goal.should.have.property('user');
                res.body.goal.should.have.property('period');
                res.body.goal.should.have.property('goalAmount');
              
            chai.request(server)
                .get('/api/goals')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1); 
                  done();
                });

            });
      });

  });

/*
Test PUT endpoint
*/
  describe('/PUT goal', () => {

        it('it should UPDATE a goal ', (done) => {

        var testRecord = {
            user: 'user@domain.com',
            period: '2013-2014',
            goalAmount: 99.55
        };

          // updated existing goal
          getDb(function (db) {
            // create the original category, then update it
            db.collection(GOAL_COLLECTION).insert(testRecord, function (err, result) {

              var newlyCreatedId = result.insertedIds[0];

            testRecord = {
              id: newlyCreatedId,
              user: 'user@domain.com',
              period: '2015-2016',
              goalAmount: 11.22
            }

            chai.request(server)
                .put('/api/goals')
                .send(testRecord)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('id');//.eql(testRecord.id);
                    res.body.should.have.property('user').eql(testRecord.user);
                    res.body.should.have.property('period').eql(testRecord.period);
                    res.body.should.have.property('goalAmount').eql(testRecord.goalAmount);
                    done();
                }); //chai.request()...

            }); //db.collection().insert... 

          });  //getDb()...
        }); 

      });


/* 
Test DELETE endpoint
*/
  describe('/DELETE goal', () => {

      it('it should DELETE a goal ', (done) => {

            var testRecord = {
              user: 'user@domain.com',
              period: '2002-2003',
              goalAmount: 123.45
            }

        getDb(function (db) {
          // create the original goal, then delete it
          db.collection(GOAL_COLLECTION).insert(testRecord, function (err, result) {
          
          //get id of record
          var newId = result.insertedIds[0];

          // invoke API to delete
          chai.request(server)
              .delete('/api/goals')
              .send({id: newId})
              .end((err, res) => {
                  res.should.have.status(204);
                  res.body.should.be.a('object');

                // check it's not there
                chai.request(server)
                    .get('/api/goals/'+newId)
                    .end((err, res) => {
                        res.should.have.status(404);
                        res.body.should.be.a('object');
                        done();
                    });
              });
          });


        }); 

      });
    });

});