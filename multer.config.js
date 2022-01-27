const path = require('path');
const multer = require('multer');

const imageStorage = multer.diskStorage({
    // Destination to store image     
    destination: path.join(__dirname, `/public/uploads/`),
    filename: (req, file, cb) => {
        const dateTS = Date.now();
        const fileExt = file.originalname.split('.')[file.originalname.split('.').length - 1];
        req.images = `/${file.fieldname}-${dateTS}.${fileExt}`,
        console.log('/${file.fieldname}-${dateTS}.${fileExt}', `/${file.fieldname}-${dateTS}.${fileExt}`); ///file-1643256138305.png
        console.log('file', file);
        cb(null, `/${file.fieldname}-${dateTS}.${fileExt}`);
    }
});
  
  const multerUpload = multer({
    storage: imageStorage,
  }).single('file');

  module.exports = {
    multerUpload
  };