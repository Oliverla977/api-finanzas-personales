const connection = require('../config/db');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');


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
    body('password')
        .trim()
        .notEmpty().withMessage('La contraseña es requerida'),
    body('identificador')
        .trim()
        .notEmpty()
        .withMessage('Debe proporcionar un email o nombre de usuario')
        
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
      error: process.env.NODE_ENV === 'local' ? error.message : undefined
    });
  }
};

exports.login = async (req, res) => {
    try{
        //verificar si hay errores de validacion
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ 
            success: false,
            errors: errors.array() 
          });
        }
        
        const { identificador, password } = req.body;

        // Buscar usuario por email o nombre de usuario
        const [users] = await connection.query(
            'SELECT * FROM usuarios WHERE correo = ? OR nombre_usuario = ? LIMIT 1',
            [identificador, identificador]
          );
    
        // Verificar si se encontró algún usuario
        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        // Obtener el primer usuario encontrado
        const user = users[0];
        //console.log(user);
    
        // Verificar contraseña
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

         // Generar JWT
        const payload = {
            user: {
            id: user.idUsuario,
            username: user.nombre_usuario,
            email: user.correo,
            moneda: user.moneda_id,
            zona_horaria: user.zona_horaria
            }
        };
    
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
    
        // Responder con el token y datos básicos del usuario
        res.json({
            token
            /*user: {
                id: user.idUsuario,
                username: user.nombre_usuario,
                email: user.correo,
                moneda: user.moneda_id,
                zona_horaria: user.zona_horaria
            }*/
        });

    }catch (error) {
        console.error('Error al iniciar sesion:', error);
        res.status(500).json({
          success: false,
          message: 'Error al iniciar sesion',
          error: process.env.NODE_ENV === 'local' ? error.message : undefined
        });
      }
};

exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({
            success: false,
            message: 'Token no proporcionado'
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: 'Token inválido'
            });
        }

        req.user = user;
        next();
    });
};

exports.verPerfil = async (req, res) => {
    try{
        const { id } = req.user.user;

        const [user] = await connection.query(
            'SELECT A.nombre_usuario AS username, A.correo, A.moneda_id, B.simbolo, A.zona_horaria, C.codigo FROM usuarios A INNER JOIN monedas B ON A.moneda_id = B.idMoneda INNER JOIN zonas_horarias C ON A.zona_horaria = C.idZonaHoraria WHERE idUsuario = ?',
            [id]
        );

        res.json({
            success: true,
            data: user[0]
        });
    }catch (error) {
        console.error('Error al obtener perfil:', error);
        res.status(500).json({
          success: false,
          message: 'Error al obtener perfil',
          error: process.env.NODE_ENV === 'local' ? error.message : undefined
        });
      }
};
