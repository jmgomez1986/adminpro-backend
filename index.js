require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/config');

const PORT = process.env.PORT || 3000;

// Crear el servidor de express
const app = express();

app.set('port', PORT);

// Configurar CORS
app.use(cors());

// Lectura y parseo del BODY
app.use(express.json());

// Base de datos
dbConnection();

// Directorio publico
app.use(express.static('public'));

// Rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/hospitales', require('./routes/hospitales'));
app.use('/api/medicos', require('./routes/medicos'));
app.use('/api/login', require('./routes/auth'));
app.use('/api/todo', require('./routes/busquedas'));
app.use('/api/upload', require('./routes/uploads'));

app.listen(PORT, () => {
	console.log('Servidor corriendo en el puerto ' + process.env.PORT);
});
