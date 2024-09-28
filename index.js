const express = require('express')
const app = express()
const port = 3000
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');
const monedasRoutes = require('./routes/monedas');

dotenv.config();
app.use(express.json());

// Ruta de monedas
app.use('/monedas', monedasRoutes);


// Cargar Swagger
const swaggerDocument = yaml.load('./swagger.yaml');
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});