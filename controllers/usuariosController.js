const connection = require('../config/db');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');

// Configuración de bcrypt
const SALT_ROUNDS = 10;

// Validacion al crear usuario
exports.validateUser = [
    body('nombre').trim().notEmpty().withMessage('El nombre es requerido'),
    body('correo')
      .trim()
      .notEmpty().withMessage('El correo es requerido')
      .isEmail().withMessage('Debe ser un correo válido')
      .normalizeEmail(),
    body('password')
      .trim()
      .notEmpty().withMessage('La contraseña es requerida')
      .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('moneda').trim().notEmpty().withMessage('La moneda es requerida'),
    body('zona_horaria')
        .trim()
        .toInt()
        .notEmpty().withMessage('La zona horaria es requerida')
      .withMessage('Zona horaria inválida')
  ];

  // Validacion al iniciar sesion
  exports.validateLogin = [
    
  ]

exports.crearUsuario = async (req, res) => {
  try {
    // Verificar si hay errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    const { nombre, correo, password, moneda, zona_horaria } = req.body;

    // Verficar si el usuario existe
    const [existingUsers] = await connection.query(
      'SELECT idUsuario FROM usuarios WHERE nombre_usuario = ?',
      [nombre]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'El usuario ya existe'
      });
    }

    // Verificar si el correo ya existe
    const [existingCorreo] = await connection.query(
      'SELECT idUsuario FROM usuarios WHERE correo = ?',
      [correo]
    );

    if (existingCorreo.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'El correo ya está registrado'
      });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Insertar el nuevo usuario
    const [result] = await connection.query(
      `INSERT INTO usuarios (nombre_usuario, correo, password, moneda_id, zona_horaria) 
       VALUES (?, ?, ?, ?, ?)`,
      [nombre, correo, hashedPassword, moneda, zona_horaria]
    );

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: {
        id: result.insertId,
        nombre,
        correo,
        moneda,
        zona_horaria
      }
    });

  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear el usuario',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.login = async (req, res) => {

}
