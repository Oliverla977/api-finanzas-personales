const connection = require('../config/db');

exports.getAllMonedas = async (req, res) => {
  try{
    const query = 'SELECT idMoneda AS id, codigoISO, simbolo, nombre FROM monedas';
    const [monedas] = await connection.query(query);
    return res.json(monedas);

  }catch(err){
    return res.status(500).json({ error: err.message });
  }
};
