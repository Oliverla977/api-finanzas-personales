const express = require('express');
const router = express.Router();
const monedasController = require('../controllers/monedasController');

//GET obtener todas las monedas
router.get('/', monedasController.getAllMonedas);

//GET obtener moneda por id
router.get('/:id', monedasController.getMonedaById);

module.exports = router;
