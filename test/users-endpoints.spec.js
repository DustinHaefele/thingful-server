const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');
const bcrypt = require('bcrypt');

describe('USERS ENDPOINTS', () => {
  let db;

  const { testUsers } = helpers.makeThingsFixtures();

  before('db connect', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('clean table', () => helpers.cleanTables(db));

  afterEach('clean tables', () => helpers.cleanTables(db));

  describe('POST api/users endpoint', () => {
    context('password validation', () => {
      beforeEach('seed table', () => helpers.seedUsers(db, testUsers));

      it('responds 400 and password must be >= 8 characters', () => {
        const shortPass = testUsers[0];
        shortPass.password = 'svnchar';
        return supertest(app)
          .post('/api/users')
          .send(shortPass)
          .expect(400, { error: 'Password must be at least 8 characters' });
      }); //it 8 char
      it('responds 400 and password must be <= 72 characters', () => {
        const longPass = testUsers[0];
        longPass.password = 'a'.repeat(73);
        return supertest(app)
          .post('/api/users')
          .send(longPass)
          .expect(400, { error: 'Password must be less than 73 characters' });
      }); //it 72char
      it('responds 400 and password cant start or end with space if password starts with a space', () => {
        const spacePass = testUsers[0];
        spacePass.password = ' aoeuidht';

        return supertest(app)
          .post('/api/users')
          .send(spacePass)
          .expect(400, { error: "Password can't start or end with a space" });
      }); //it space begin

      it('responds 400 and password cant start or end with space if password ends in a space', () => {
        const spacePass = testUsers[0];
        spacePass.password = 'aoeuidht ';

        return supertest(app)
          .post('/api/users')
          .send(spacePass)
          .expect(400, { error: "Password can't start or end with a space" });
      }); //it space begin

      const invalidPasswords = [
        'Nonumbers!',
        'NOLOWERS1!',
        'nouppers1!',
        'Nospecials1'
      ];

      invalidPasswords.forEach(pass => {
        it(`responds 400 need 1 special character, 1 uppercase letter, 1 lowercase letter, and 1 number ${pass}`, () => {
          const invaldPassword = testUsers[0];
          invaldPassword.password = pass;

          return supertest(app)
            .post('/api/users')
            .send(invaldPassword)
            .expect(400, {
              error:
                'password needs 1 special character, 1 uppercase letter, 1 lowercase letter, and 1 number'
            });
        }); //it
      }); //forEach
      it('returns 400 and username already exists if username is a repeat', () => {
        const repeatUserName = testUsers[0];
        repeatUserName.password = 'ValidPass1!';
        repeatUserName.id = '73';

        return supertest(app)
          .post('/api/users')
          .send(repeatUserName)
          .expect(400, { error: 'Username already exists' });
      });
    }); //context user validation

    context.only('happy path', () => {
      it('responds 201, storing hashed password, with serialized user', () => {
        const newUser = {
          user_name: 'MyTestUserName',
          password: 'ValidPass1!',
          full_name: 'Test FullName'
        };

        return supertest(app)
          .post('/api/users')
          .send(newUser)
          .expect(201)
          .expect(res => {
            //expect(res.body).to.have.property('id');
            expect(res.body.user_name).to.eql(newUser.user_name);
            expect(res.body.full_name).to.eql(newUser.full_name);
            expect(res.body.nickname).to.eql('');
            //expect(res.headers.location).to.eql(`/api/users/${res.body.id}`);
          })
          .expect(() => {

            db('thingful_users')
              .select('*')
              .where({ user_name: newUser.user_name })
              .first()
              .then(row => {
                expect(row).to.have.property('id');
                expect(row.user_name).to.eql(newUser.user_name);
                expect(row.full_name).to.eql(newUser.full_name);
                expect(row.nickname).to.eql(null);
                return bcrypt.compare(newUser.password, row.password);
                
              }).then(match=>{
                expect(match).to.be.true;
              })
          });
      });
    });
  }); //endpoint describe
}); //main describe
