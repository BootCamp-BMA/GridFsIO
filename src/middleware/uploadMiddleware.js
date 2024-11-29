//uploadMiddlware
const multer = require('multer');
require('dotenv').config()

const MAX_GLBSIZE = process.env.MAX_GLBSIZE * 1024 * 1024; 
const MAX_IMAGE_SIZE = process.env.MAX_IMAGE_SIZE * 1024 * 1024; 


const storage = multer.memoryStorage();


const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {

        const fileExtension = file.originalname.split('.').pop().toLowerCase();
        
        if (fileExtension === 'glb') {

            if (file.size > MAX_GLBSIZE) {
                return cb(new Error('File size exceeds the 40MB limit for .glb files.'));
            }
        } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(fileExtension)) {

            if (file.size > MAX_IMAGE_SIZE) {
                return cb(new Error('File size exceeds the 5MB limit for image files.'));
            }
        } else {

            return cb(new Error('Unsupported file type.'));
        }
        

        cb(null, true);
    },
}).single('file');

module.exports.handleUpload = (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ message: 'File upload failed', error: err.message });
        }
        next();
    });
};
