const connection = require('../config/db');

exports.getAllMonedas = async (req, res) => {
  try {
    const [monedas] = await connection.query(
      'SELECT idMoneda AS id, codigoISO, simbolo, nombre FROM monedas'
    );
    return res.json(monedas);
  } catch (err) {
    return res.status(500).json({ 
      error: err.message 
    });
  }
};

exports.getMonedaById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar que el id es un entero
    if (!Number.isInteger(Number(id))) {
      return res.status(400).json({ error: 'El ID es invalido' });
    }

    // Consultar la moneda por id
    const [moneda] = await connection.query(
      'SELECT idMoneda AS id, codigoISO, simbolo, nombre FROM monedas WHERE idMoneda = ?', 
      [id]
    );

    // Verificar si la moneda existe
    if (moneda.length === 0) {
      return res.status(404).json({ error: 'Moneda no encontrada' });
    }

    return res.json(moneda[0]);
  } catch (err) {
    return res.status(500).json({
      error: err.message 
    });
  }
};
