const fs = require('fs');
const path = require('path');

let lastVideo = null;  // Variable para guardar el último video mostrado

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

// Función que programa el cambio de video a medianoche
const scheduleVideoChange = () => {
    const now = new Date();
    const nextMidnight = new Date();
    nextMidnight.setHours(24, 0, 0, 0);  // Establecer la próxima medianoche
    const timeUntilMidnight = nextMidnight - now;

    setTimeout(() => {
        // Cambiar el video automáticamente a las 12 de la noche
        const videoDir = path.join(__dirname, '../public/videos/');
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

module.exports = { scheduleVideoChange, selectRandomVideo };
