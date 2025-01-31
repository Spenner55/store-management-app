const express = require('express');
const router = express.Router();
const employeesController = require('../controllers/employeeController');

router.route('/')
    .get(employeesController.getAllEmployees)
    .post(employeesController.createNewEmployee)
    .patch(employeesController.updateEmployee)
    .delete(employeesController.deleteEmployee);

module.exports = router;