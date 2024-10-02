const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Importar multer desde config/multerConfig
const upload = require('../config/multerConfig');

// Importar funciones de cambio de video desde utils/scheduleVideoChange
const { selectRandomVideo } = require('../utils/scheduleVideoChange');

let lastVideo = null;  // Variable para guardar el último video mostrado

// Ruta para la página principal
router.get('/', (req, res) => {
    const videoDir = path.join(__dirname, '../public/videos/');
    
    fs.readdir(videoDir, (err, files) => {
        if (err) {
            console.log('Error al leer los videos:', err);
            return res.render('index', { video: null });
        }

        const videos = files.filter(file => {
            return typeof file === 'string' && ['.mp4', '.avi', '.mov', '.wmv'].includes(path.extname(file));
        });

        if (videos.length === 0) {
            return res.render('index', { video: null });
        }

        const randomVideo = selectRandomVideo(videos);
        res.render('index', { video: randomVideo });
    });
});

// Ruta para la página de administración
router.get('/upload', (req, res) => {
    res.render('upload');
});

// Ruta para manejar la subida de múltiples videos
router.post('/upload', upload.array('videos', 10), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).send('No se ha subido ningún video.');
    }
    res.redirect('/');
});

module.exports = router;
