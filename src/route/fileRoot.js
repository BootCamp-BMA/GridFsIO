//fileRoote
const router = require('express').Router();
const {retrieveFileController,uploadFileController} =require('../controller/fileController.js')
const {handleUpload} = require('../middleware/uploadMiddleware.js')


router.get('/',(req,res,next)=>{
    res.status(200).json({'message':'home page '});
})

router.post('/upload',handleUpload,uploadFileController )
router.get('/retrieve/:id', retrieveFileController);

module.exports=router;