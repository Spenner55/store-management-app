const express = require('express');
const router = express.Router();
const schedulesController = require('../controllers/schedulesController');
const verifyJWT = require('../middleware/verifyJWT');
const verifyRole = require('../middleware/verifyRoles');

router.use(verifyJWT);

router.get('/me', schedulesController.getMyShifts);
router.get('/', schedulesController.getAllShifts);

router.post('/', verifyRole('Manager', 'Admin'), schedulesController.createNewShift);
router.put('/:id', verifyRole('Manager', 'Admin'), schedulesController.updateShift);
router.delete('/:id', verifyRole('Manager', 'Admin'), schedulesController.deleteShift);

module.exports = router;