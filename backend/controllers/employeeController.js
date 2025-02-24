const Employee = require('../models/employee')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

const getAllEmployees = asyncHandler(async (req, res) =>{
    const employees = Employee.find().select('-password').lean();

    if(!employees?.length) {
        return res.status(400).json({message: 'No Employees Found'})
    }
    res.json(employees);
})

const createNewEmployee = asyncHandler(async (req, res) =>{
    const { first_name, last_name, email, password, department } = req.body;

    if(!first_name || !last_name || !email || !password) {
        res.status(400).json({message: 'Required Fields Not Completed'});
    }

    const hashedpwd = await bcrypt.hash(password, 10);

    employeeObject = {first_name, last_name, "password": hashedpwd, email, department}

    const employee = await Employee.create(employeeObject);

    if(employee) {
        res.status(201).json({message: `New Employee${first_name} ${last_name} created`});
    }
    else {
        res.status(400).json({message: "Invalid employee data recieved"});
    }

})

const updateEmployee = asyncHandler(async (req, res) =>{
    const { id, first_name, last_name, email, department, wage, role, password } = req.body;

    if(!id || !first_name || !last_name || !email || !department || !wage || !role) {
        res.status(400).json({ message: "All fields are required"});
    }

    const employee = await Employee.findById(id).exec();

    if(!employee) {
        res.status(400).json({message: "No employee found"});
    }

    employee.first_name = first_name;
    employee.last_name = last_name;
    employee.email = email;
    employee.department = department;
    employee.wage = wage;
    employee.role = role;

    if(password) {
        hashedpwd = await bcrypt.hash(password, 10)
    }

    employee.password = hashedpwd;

    const updatedEmployee = await employee.save();

    res.json({message: `Employee :${updatedEmployee.first_name} ${updatedEmployee.last_name}, has been updated`})

})

const deleteEmployee = asyncHandler(async (req, res) =>{
    const {id} = req.body;

    if(!id) {
        res.status(400).json({message: "Missing id"});
    }

    const employee = await Employee.findById(id).exec();

    if(!employee) {
        res.status(400).json({message: `No employee with id: ${id} found`});
    }

    const deletedEmployee = await employee.deleteOne();

    res.json({message: `Employee: ${deletedEmployee.first_name} ${deletedEmployee.last_name} with id: ${deletedEmployee.id} deleted`})

})

module.exports = {
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
}