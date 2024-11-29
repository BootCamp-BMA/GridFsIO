//fileModel

const { getGridFSBucket}=require('../config/db')
const {Readable} = require('stream')
const {ObjectId} = require('mongodb')



module.exports.uploadFile = async (fileStream, filename, metadata) => {
    const bucket = await getGridFSBucket();
  
    return new Promise((resolve, reject) => {
      const uploadStream = bucket.openUploadStream(filename, { metadata });
  
      // For memory storage, the file content will be in req.file.buffer, which is a Buffer.
      const bufferStream = new Readable();
      bufferStream.push(fileStream); // Pushing the buffer
      bufferStream.push(null); // Indicate end of stream
  
      bufferStream.pipe(uploadStream); // Pipe the buffer stream to GridFS
  
      uploadStream.on('finish', () => {
        resolve(uploadStream.id); // Resolve with file ID
      });
  
      uploadStream.on('error', (err) => {
        reject(err); // Reject on error
      });
    });
  };
  
  module.exports.getFileById = async (fileId) => {
    const bucket = await getGridFSBucket();
  
    return new Promise((resolve, reject) => {
      try {
        const downloadStream = bucket.openDownloadStream(new ObjectId(fileId));
        resolve(downloadStream);
      } catch (err) {
        reject(err);
      }
    });
  };

 