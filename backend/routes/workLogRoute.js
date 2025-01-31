const express = require('express');
const router = express.Router();
const workLogController = require('../controllers/workLogController');

router.route('/')
    .get(workLogController.getAllWorkLogs)
    .get(workLogController.getEmployeeWorkLogs)
    .post(workLogController.createNewWorkLog);

module.exports = router;