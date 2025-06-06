const express = require('express');
const router = express.Router();
const workLogController = require('../controllers/workLogController');
const verifyJWT = require('../middleware/verifyJWT');

router.get('/', workLogController.getAllWorkLogs)

router.use(verifyJWT);

router.post('/', workLogController.createNewWorkLog);

router.get('/:employee_id', workLogController.getEmployeeWorkLogs);

module.exports = router;