const express = require('express');
const { verifyToken } = require('../middleware/auth');
const { 
  rubroController, 
  unidadController, 
  areaController 
} = require('../controllers/listasController');

const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(verifyToken);

// Rutas para Rubros
router.route('/rubros')
  .get(rubroController.getItems)
  .post(rubroController.createItem);

router.route('/rubros/:id')
  .put(rubroController.updateItem)
  .delete(rubroController.deleteItem);

// Rutas para Unidades
router.route('/unidades')
  .get(unidadController.getItems)
  .post(unidadController.createItem);

router.route('/unidades/:id')
  .put(unidadController.updateItem)
  .delete(unidadController.deleteItem);

// Rutas para Áreas
router.route('/areas')
  .get(areaController.getItems)
  .post(areaController.createItem);

router.route('/areas/:id')
  .put(areaController.updateItem)
  .delete(areaController.deleteItem);

module.exports = router;
