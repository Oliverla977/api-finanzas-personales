const connection = require('../config/db');
const { validationResult, param } = require('express-validator');

exports.validateId = [
    param('id')
        .trim()
        .toInt()
        .notEmpty().withMessage('El ID es requerido')
        .isInt().withMessage('El ID debe ser un número entero')
];

exports.getAllZonasHorarias = async (req, res) => {
    try {
        const [zonasHorarias] = await connection.query(
        'SELECT idZonaHoraria AS id, codigo, nombre, offset FROM zonas_horarias WHERE activo = 1'
        );
        return res.json(zonasHorarias);
    } catch (error) {
        console.error('Error al obtener zona horaria:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener zona horaria',
            error: process.env.NODE_ENV === 'local' ? error.message : undefined
        });
    }
};

exports.getZonaHorariaById = async (req, res) => {
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

        const [zonaHoraria] = await connection.query(
            'SELECT idZonaHoraria AS id, codigo, nombre, offset FROM zonas_horarias WHERE activo = 1 AND idZonaHoraria = ?',
            [id]
        );

        // Validar que existe la zona horaria
        if (zonaHoraria.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Zona horaria no encontrada'
            });
        }

        return res.json(zonaHoraria[0]);

    }catch(error){
        console.error('Error al obtener zona horaria por id:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener zona horaria por id',
            error: process.env.NODE_ENV === 'local' ? error.message : undefined
        });
    }
};