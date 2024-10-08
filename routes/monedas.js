const express = require('express');
const router = express.Router();
const monedasController = require('../controllers/monedasController');

router.get('/', monedasController.getAllMonedas);

router.get('/:id', monedasController.getMonedaById);

module.exports = router;
