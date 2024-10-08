const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');

//POST /usuarios/registro creacion de nuevos usuarios con validacion de datos
router.post('/registro', usuariosController.validateUser, usuariosController.crearUsuario);

//POST /usuarios/login inicio de sesion de usuarios
router.post('/login', usuariosController.login);

module.exports = router;