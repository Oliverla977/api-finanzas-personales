const connection = require('../config/db');

const getAllMonedas = (req, res) => {
  const query = 'SELECT idMoneda AS id, codigoISO, simbolo, nombre FROM monedas';
  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

module.exports = {
  getAllMonedas
};
