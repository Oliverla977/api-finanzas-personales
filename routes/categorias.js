const express = require('express');
const router = express.Router();
const categoriasController = require('../controllers/categoriasController');
const usuariosController = require('../controllers/usuariosController');

//POST /categorias crear nueva categoria
router.post('/', categoriasController.validateCategoria, usuariosController.authenticateToken, categoriasController.crearCategoria);

module.exports = router;