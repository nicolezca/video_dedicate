const express = require('express');
const path = require('path');
const app = express();
const { configDotenv } = require('dotenv');
configDotenv();

// Configurar EJS como motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Asegúrate de tener esta línea
app.use(express.static(path.join(__dirname, 'public/css')));
app.use( express.static(path.join(__dirname, 'public/videos')));

// Importar las rutas
const routes = require('./routes/routes');
app.use('/', routes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal! ' + err.message);
});

// Importar la función para el cambio de video a medianoche
const { scheduleVideoChange } = require('./utils/scheduleVideoChange');

// Iniciar el servidor y programar el cambio de video
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
    scheduleVideoChange();  // Iniciar la programación del cambio de video
});