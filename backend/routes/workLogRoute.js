const express = require('express');
const router = express.Router();
const workLogController = require('../controllers/workLogController');
const verifyJWT = require('../middleware/verifyJWT');

router.use(verifyJWT);

router.route('/')
    .get(workLogController.getAllWorkLogs)
    .get(workLogController.getEmployeeWorkLogs)
    .post(workLogController.createNewWorkLog);

module.exports = router;