const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products');

router.get('/', productsController.getAll);
router.get('/:id', productsController.get);

module.exports = router;
