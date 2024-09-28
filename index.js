const express = require('express')
const app = express()
const port = 3000
const dotenv = require('dotenv');

const monedasRoutes = require('./routes/monedas');

dotenv.config();
// Middleware para parsear JSON
app.use(express.json());

// Ruta de monedas
app.use('/monedas', monedasRoutes);

app.get('/', (req, res) => {
  res.send('Hola Mundo');
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});