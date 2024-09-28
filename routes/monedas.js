const express = require('express');
const router = express.Router();
const monedasController = require('../controllers/monedasController');

router.get('/', monedasController.getAllMonedas);

module.exports = router;
