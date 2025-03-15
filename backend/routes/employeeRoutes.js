const express = require('express');
const router = express.Router();
const employeesController = require('../controllers/employeeController');
const verifyJWT = require('../middleware/verifyJWT');

router.use(verifyJWT);


router.route('/')
    .get(employeesController.getAllEmployees)
    .post(employeesController.createNewEmployee)
    .patch(employeesController.updateEmployee)
    .delete(employeesController.deleteEmployee);

module.exports = router;