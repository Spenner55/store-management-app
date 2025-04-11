const express = require('express');
const router = express.Router();
const workLogController = require('../controllers/workLogController');
const verifyJWT = require('../middleware/verifyJWT');

router.use(verifyJWT);

router.route('/')
    .get(workLogController.getAllWorkLogs)
    .post(workLogController.createNewWorkLog);

router.route('/:employee_id')
    .get(workLogController.getEmployeeWorkLogs);

module.exports = router;