const express = require('express');
const path = require('path');
const app = express();

// Configurar EJS como motor de plantillas
app.set('view engine', 'ejs');
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/videos', express.static(path.join(__dirname, 'public/videos')));

// Importar las rutas
const routes = require('./routes/routes');
app.use('/', routes);

// Importar la función para el cambio de video a medianoche
const { scheduleVideoChange } = require('./utils/scheduleVideoChange');

// Iniciar el servidor y programar el cambio de video
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
    scheduleVideoChange();  // Iniciar la programación del cambio de video
});