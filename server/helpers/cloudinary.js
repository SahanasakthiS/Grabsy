const cloudinary = require('cloudinary').v2;
const multer = require('multer');

cloudinary.config({
    cloud_name: 'dq5anfprb',
    api_key : '585889449773356',
    api_secret : 'X_nFqA-xUfUsRcHHst3lY104idI',
});

const storage = new multer.memoryStorage();

async function imageUploadUtil(file) {
    const result = await cloudinary.uploader.upload(file, {
        resource_type: 'auto'
    })

    return result;
}

const upload = multer({storage});

module.exports = {upload, imageUploadUtil}