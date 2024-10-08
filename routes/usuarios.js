const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');

//POST /usuarios/registro creacion de nuevos usuarios con validacion de datos
router.post('/registro', usuariosController.validateUser, usuariosController.crearUsuario);

//POST /usuarios/login inicio de sesion de usuarios
router.post('/login', usuariosController.validateLogin, usuariosController.login);

//GET /usuarios/perfil obtencion de datos del usuario
router.get('/perfil', usuariosController.authenticateToken, usuariosController.verPerfil);

module.exports = router;