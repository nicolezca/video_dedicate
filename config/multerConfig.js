const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/videos/');
    },
    filename: (req, file, cb) => {
        const videoDir = path.join(__dirname, '../public/videos/');
        fs.readdir(videoDir, (err, files) => {
            if (err) {
                console.log('Error al leer la carpeta de videos:', err);
                return cb(err);
            }

            const videos = files.filter(file => ['.mp4', '.avi', '.mov', '.wmv'].includes(path.extname(file)));
            const videoNumber = videos.length + 1;
            const newFileName = `video${String(videoNumber).padStart(2, '0')}${path.extname(file.originalname)}`;
            cb(null, newFileName);
        });
    }
});

const upload = multer({ storage: storage });

module.exports = upload;
