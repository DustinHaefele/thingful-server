const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');



describe.only('USERS ENDPOINTS',()=>{
  let db;

  const { testUsers } = helpers.makeThingsFixtures();


  before('db connect',()=>{
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    });
  });

  after('disconnect from db',()=> db.destroy());

  before('clean table', ()=> helpers.cleanTables(db));
  
  afterEach('clean tables',()=> helpers.cleanTables(db));

  describe('POST api/users endpoint',()=>{
    context('user validation',()=>{
      it('responds 400 and password must be >= 8 characters', ()=>{
        const shortPass = testUsers[0];
        shortPass.password = 'svnchar';
        return supertest(app)
          .post('/api/users')
          .send(shortPass)
          .expect(400, {error: 'Password must be at least 8 characters'});
      });//it 8 char
      it('responds 400 and password must be <= 72 characters', ()=>{
        const longPass = testUsers[0];
        longPass.password = 'a'.repeat(73);
        return supertest(app)
          .post('/api/users')
          .send(longPass)
          .expect(400, {error: 'Password must be less than 73 characters'});
      });//it 72char
      it('responds 400 and password cant start or end with space if password starts with a space',()=>{
        const spacePass = testUsers[0];
        spacePass.password = ' aoeuidht';

        return supertest(app)
          .post('/api/users')
          .send(spacePass)
          .expect(400, {error: 'Password can\'t start or end with a space'});
      });//it space begin
      it('responds 400 and password cant start or end with space if password ends in a space',()=>{
        const spacePass = testUsers[0];
        spacePass.password = 'aoeuidht ';

        return supertest(app)
          .post('/api/users')
          .send(spacePass)
          .expect(400, {error: 'Password can\'t start or end with a space'});
      });//it space begin
      it('responds 400 ')
    });//context user validation
  });//endpoint describe

});//main describe
