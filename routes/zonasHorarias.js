const express = require('express');
const router = express.Router();
const zonaHorariaController = require('../controllers/zonaHorariaController');

//GET obtener todas las zonas horarias
router.get('/', zonaHorariaController.getAllZonasHorarias);

//GET obtener zona horaria por id
router.get('/:id', zonaHorariaController.validateId, zonaHorariaController.getZonaHorariaById);

module.exports = router;
