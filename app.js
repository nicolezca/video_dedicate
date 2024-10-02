const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

let lastVideo = null;  // Variable para guardar el último video mostrado

// Configurar EJS como motor de plantillas
app.set('view engine', 'ejs');
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/videos', express.static(path.join(__dirname, 'public/videos')));

// Configurar multer para manejar la carga de múltiples archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/videos/');  // Carpeta donde se guardarán los videos
    },
    filename: (req, file, cb) => {
        const videoDir = path.join(__dirname, 'public/videos/');
        // Leer los archivos de la carpeta de videos para contar cuántos hay
        fs.readdir(videoDir, (err, files) => {
            if (err) {
                console.log('Error al leer la carpeta de videos:', err);
                return cb(err);
            }

            // Filtrar solo los archivos de video
            const videos = files.filter(file => ['.mp4', '.avi', '.mov', '.wmv'].includes(path.extname(file)));
            const videoNumber = videos.length + 1;  // Asignar el siguiente número
            const newFileName = `video${String(videoNumber).padStart(2, '0')}${path.extname(file.originalname)}`;
            cb(null, newFileName);
        });
    }
});
const upload = multer({ storage: storage });

// Función para seleccionar un video aleatorio que no se repita
const selectRandomVideo = (videos) => {
    const filteredVideos = videos.filter(video => video !== lastVideo);  // Excluir el último video mostrado
    if (filteredVideos.length === 0) {
        return null;
    }
    const randomVideo = filteredVideos[Math.floor(Math.random() * filteredVideos.length)];
    lastVideo = randomVideo;  // Actualizar el último video mostrado
    return randomVideo;
};

// Ruta para la página principal
app.get('/', (req, res) => {
    const videoDir = path.join(__dirname, 'public/videos/');
    
    // Leer los archivos de la carpeta de videos
    fs.readdir(videoDir, (err, files) => {
        if (err) {
            console.log('Error al leer los videos:', err);
            return res.render('index', { video: null });
        }

        // Filtrar solo los archivos de video
        const videos = files.filter(file => {
            return typeof file === 'string' && ['.mp4', '.avi', '.mov', '.wmv'].includes(path.extname(file));
        });

        if (videos.length === 0) {
            return res.render('index', { video: null });
        }

        // Seleccionar un video aleatorio que no se repita
        const randomVideo = selectRandomVideo(videos);

        // Renderizar la página con el video seleccionado
        res.render('index', { video: randomVideo });
    });
});

// Ruta para la página de administración
app.get('/upload', (req, res) => {
    res.render('upload');
});

// Ruta para manejar la subida de múltiples videos
app.post('/upload', upload.array('videos', 10), (req, res) => {  // Cambiado a "videos"
    if (!req.files || req.files.length === 0) {
        return res.status(400).send('No se ha subido ningún video.');
    }
    
    res.redirect('/');
});

// Programar el cambio de video a las 12 de la noche
const scheduleVideoChange = () => {
    const now = new Date();
    const nextMidnight = new Date();
    nextMidnight.setHours(24, 0, 0, 0);  // Establecer la próxima medianoche
    const timeUntilMidnight = nextMidnight - now;

    setTimeout(() => {
        // Cambiar el video automáticamente a las 12 de la noche
        const videoDir = path.join(__dirname, 'public/videos/');
        fs.readdir(videoDir, (err, files) => {
            if (err) {
                console.log('Error al leer los videos para el cambio automático:', err);
                return;
            }

            const videos = files.filter(file => ['.mp4', '.avi', '.mov', '.wmv'].includes(path.extname(file)));
            lastVideo = null;  // Reiniciar el video para permitir mostrar cualquier video al azar
            selectRandomVideo(videos);  // Seleccionar el nuevo video aleatorio
            console.log('El video ha sido cambiado a medianoche.');
        });

        // Programar el próximo cambio de video
        scheduleVideoChange();
    }, timeUntilMidnight);
};

// Iniciar el servidor y programar el cambio de video
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
    scheduleVideoChange();  // Iniciar la programación del cambio de video
});
