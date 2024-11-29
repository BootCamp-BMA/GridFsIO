const { MongoClient, GridFSBucket } = require('mongodb');

const url = "mongodb://localhost/";
const client = new MongoClient(url);
const dbname = 'file';

let dbInstance; // Cached database instance

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
