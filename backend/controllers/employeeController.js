const pool = require('../config/connect')
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');

const getAllEmployees = asyncHandler(async (req, res) => {
  const { rows: employees } = await pool.query(
    'SELECT id, first_name, last_name, email, department, role, wage FROM employees'
  );

  if (!employees.length) {
    return res.status(400).json({ message: 'No Employees Found' });
  }

  res.json(employees);
});

const createNewEmployee = asyncHandler(async (req, res) => {
  const { first_name, last_name, email, password, department } = req.body;

  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ message: 'Required Fields Not Completed' });
  }

  const hashedpwd = await bcrypt.hash(password, 10);

  const insertText = `
    INSERT INTO employees (first_name, last_name, email, password, department)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, first_name, last_name
  `;
  const { rows: employee } = await pool.query(insertText, [
    first_name,
    last_name,
    email,
    hashedpwd,
    department,
  ]);

  res.status(201).json({ message: `New Employee ${employee.first_name} ${employee.last_name} created` });
});

const updateEmployee = asyncHandler(async (req, res) => {
  const { id, first_name, last_name, email, department, wage, role, password } = req.body;

  if (!id || !first_name || !last_name || !email || !department || !wage || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const { rows: foundRows } = await pool.query(
    'SELECT * FROM employees WHERE id = $1',
    [id]
  );

  if (!foundRows.length) {
    return res.status(400).json({ message: "No employee found" });
  }
  const employee = foundRows[0];

  const hashedpwd = password ? await bcrypt.hash(password, 10) : employee.password;

  const updateText = `
    UPDATE employees
    SET 
      first_name = $1,
      last_name = $2,
      email = $3,
      department = $4,
      wage = $5,
      role = $6,
      password = $7
    WHERE id = $8
    RETURNING first_name, last_name
  `;
  const { rows: updatedRows } = await pool.query(updateText, [
    first_name,
    last_name,
    email,
    department,
    wage,
    role,
    hashedpwd,
    id,
  ]);
  const updatedEmployee = updatedRows[0];

  res.json({ message: `Employee ${updatedEmployee.first_name} ${updatedEmployee.last_name} has been updated` });
});

const deleteEmployee = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Missing id" });
  }

  const deleteText = `
    DELETE FROM employees
    WHERE id = $1
    RETURNING first_name, last_name
  `;
  const { rows } = await pool.query(deleteText, [id]);
  const deletedEmployee = rows[0];

  if (!deletedEmployee) {
    return res.status(400).json({ message: 'No employee found to delete' });
  }

  res.json({ message: `Employee ${deletedEmployee.first_name} ${deletedEmployee.last_name} deleted` });
});

module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee
}