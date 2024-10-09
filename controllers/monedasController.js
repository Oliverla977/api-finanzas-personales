const connection = require('../config/db');
const {validationResult, param } = require('express-validator');

exports.validateId = [
  param('id')
      .trim()
      .toInt()
      .notEmpty().withMessage('El ID es requerido')
      .isInt().withMessage('El ID debe ser un número entero')
];

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
    // Verificar si hay errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false,
            errors: errors.array() 
        });
    }

    const { id } = req.params;

    // Consultar la moneda por id
    const [moneda] = await connection.query(
      'SELECT idMoneda AS id, codigoISO, simbolo, nombre FROM monedas WHERE idMoneda = ?', 
      [id]
    );

    // Verificar si la moneda existe
    if (moneda.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Moneda no encontrada' 
      });
    }

    return res.json(moneda[0]);

  } catch(error){
    console.error('Error al obtener moneda por id:', error);
    res.status(500).json({
        success: false,
        message: 'Error al obtener moneda por id',
        error: process.env.NODE_ENV === 'local' ? error.message : undefined
    });
}
};
