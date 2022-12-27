const dbConnection = require('../config/mongoConnection');
const mongoCollections = require('../config/mongoCollections');
const uuid = require('uuid');

const employees = mongoCollections.employees;
const employers = mongoCollections.employers;

const main = async () => {
  const db = await dbConnection();
  await db.dropDatabase();
  const employeeCollection = await employees();
  const employerCollection = await employers();

  await employeeCollection.insertMany([
    //filler employee data
    {
      _id: uuid.v4(),
      firstName: 'Patrick',
      lastName: 'Hill',
      employerId: 1
    },
    {
      _id: uuid.v4(),
      firstName: 'Jimi',
      lastName: 'Hendrix',
      employerId: 1
    },
    {
      _id: uuid.v4(),
      firstName: 'Jim',
      lastName: 'Morrison',
      employerId: 2
    },
    {
      _id: uuid.v4(),
      firstName: 'Roger',
      lastName: 'Waters',
      employerId: 1
    },
    {
      _id: uuid.v4(),
      firstName: 'John',
      lastName: 'Smith',
      employerId: 2
    }
  ]);

  await employerCollection.insertMany([
    //filler employer data
    {
      _id: 1,
      name: 'Stevens Institute of Technology'
    },
    {
      _id: 2,
      name: 'Google'
    },
    {
      _id: 3,
      name: 'Apple'
    }
  ]);

  console.log('Done seeding database');
  await db.serverConfig.close();
};

main().catch(console.log);
