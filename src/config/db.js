const { MongoClient, GridFSBucket } = require('mongodb');
require('dotenv').config()

const url = process.env.MONGO_URL;
const client = new MongoClient(url);
const dbname = process.env.DB_NAME ;

let dbInstance; 

module.exports.connectMongo = async () => {
  if (!dbInstance) {
    try {
      console.log('... waiting to connect to MongoDB');
      await client.connect();
      dbInstance = client.db(dbname);
      console.log('Connected to MongoDB successfully');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw error;
    }
  }
  return dbInstance;
};

module.exports.getGridFSBucket = async () => {
  const db = await module.exports.connectMongo();
  return new GridFSBucket(db, { bucketName: 'uploads' });
};
