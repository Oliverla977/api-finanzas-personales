const connection = require('../config/db');

const getAllMonedas = (req, res) => {
  const query = 'SELECT * FROM MONEDA';
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
