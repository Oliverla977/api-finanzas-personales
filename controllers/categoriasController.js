const connection = require('../config/db');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Categoria = require('../models/categoriaModel');

//validaciones
exports.validateCategoria = [
    body('nombre')
        .trim()
        .notEmpty()
        .withMessage('El nombre es requerido')
        .isLength({ min: 3 })
        .withMessage('El nombre debe tener al menos 3 caracteres')
        .matches(/^[A-Za-z0-9]+$/)
        .withMessage('El nombre solo puede contener letras y números'),
    body('tipo')
        .trim()
        .notEmpty()
        .withMessage('El tipo es requerido')
];

exports.crearCategoria = async (req, res) => {
    try{
        // Verificar si hay errores de validación
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false,
            errors: errors.array() 
        });
        }

        const { id } = req.user.user; //id obtenida del token
        idUser = id;
        //console.log(req.user);
        const { nombre, tipo} = req.body;

        // Verficar si la categoria existe
        const [existingcategories] = await connection.query(
            'SELECT idCategoria FROM categorias WHERE nombre = ?',
            [nombre]
        );
    
        if (existingcategories.length > 0) {
            return res.status(400).json({
            success: false,
            message: 'La categoria ya existe'
            });
        }

         // Insertar el nuevo usuario
        const [result] = await connection.query(
            `INSERT INTO categorias (usuario_id, nombre, tipo) 
            VALUES (?, ?, ?)`,
            [idUser, nombre, tipo]
        );

        res.status(201).json({
            success: true,
            message: 'Categoria creada exitosamente',
            data: {
              id: result.insertId,
              idUser,
              nombre,
              tipo
            }
          });

    } catch (error) {
        console.error('Error al crear la categoria:', error);
        res.status(500).json({
          success: false,
          message: 'Error al crear la categoria',
          error: process.env.NODE_ENV === 'local' ? error.message : undefined
        });
      }
};