//fileController
const { ObjectId } = require('mongodb');
const { getGridFSBucket } = require('../config/db');
const { uploadFile, getFileById } = require("../model/fileModel")

module.exports.uploadFileController = async (req, res, next) => {
    try {
      const fileStream = req.file.buffer; // Use buffer for memory storage
      const filename = req.file.originalname;
      const metadata = {};
  
      console.log('Uploading file:', filename); // Log the filename to verify
  
      const fileId = await uploadFile(fileStream, filename, metadata);
  
      console.log('File uploaded with ID:', fileId); // Log the fileId to verify
  
      res.status(200).json({ message: 'File uploaded successfully', fileId });
    } catch (error) {
      console.error('Error during file upload:', error);
      res.status(500).json({ message: 'Server error' }); 
    }
  };

  module.exports.retrieveFileController = async (req, res, next) => {
    try {
      const fileId = req.params.id; // File ID from the request parameter
      console.log('Retrieving file with ID:', fileId);
  
      // Get the download stream from the model
      const downloadStream = await getFileById(fileId);
  
      res.setHeader('Content-Type', 'application/octet-stream'); // Set the appropriate content type
      res.setHeader('Content-Disposition', 'attachment'); // Force download in browser
  
      // Pipe the file stream to the response
      downloadStream.pipe(res);
  
      // Handle errors in the download stream
      downloadStream.on('error', (err) => {
        console.error('Error while streaming file:', err);
        if (err.code === 'ENOENT') {
          return res.status(404).json({ message: 'File not found' });
        }
        res.status(500).json({ message: 'Error retrieving file', error: err.message });
      });
  
      downloadStream.on('end', () => {
        console.log('File retrieved successfully');
      });
    } catch (error) {
      console.error('Error during file retrieval:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };