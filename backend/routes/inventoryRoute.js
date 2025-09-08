const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const verifyJWT = require('../middleware/verifyJWT');

router.get('/', inventoryController.getInventoryByDepartment);
router.get('/:item_id', inventoryController.getInventoryByItem);

router.use(verifyJWT);

router.patch('/', inventoryController.editInventory);

router.post('/', inventoryController.createNewItem);

module.exports = router;