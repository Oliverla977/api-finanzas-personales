const express = require('express')
const app = express()
const port = 3000
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');
const fs = require('fs');
const monedasRoutes = require('./routes/monedas');
const usuariosRoutes = require('./routes/usuarios');
const zonasRoutes = require('./routes/zonasHorarias');

dotenv.config();
app.use(express.json());

// Ruta de monedas
app.use('/monedas', monedasRoutes);

// Ruta de usuarios
app.use('/usuarios', usuariosRoutes);

// Ruta para obtener las zonas horarias
app.use('/zonas', zonasRoutes);


// Cargar Swagger
const swaggerDocument = yaml.load('./swagger.yaml');
// Cambiar dinámicamente el servidor según el entorno
swaggerDocument.servers = [
  {
    url: process.env.NODE_ENV === 'production' ? process.env.PRODUCTION_SERVER_URL : process.env.LOCAL_SERVER_URL,
    description: process.env.NODE_ENV === 'production' ? 'Servidor de Producción' : 'Servidor Local'
  }
];

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});