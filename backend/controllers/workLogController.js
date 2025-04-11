const pool = require('../config/connect');
const asyncHandler = require('express-async-handler');

const getAllWorkLogs = asyncHandler(async (req, res) => {
    const { rows: workLogs } = await pool.query('SELECT * FROM worklogs');

    if(!workLogs?.length) {
        return res.status(400).json({message: 'No Work Logs Found'});
    }

    res.json(workLogs);
});

const getEmployeeWorkLogs = asyncHandler(async (req, res) => {
    const {employee_id} = req.params;
    
    const { rows: workLogs } = await pool.query(
        'SELECT * FROM worklogs WHERE employee_id = $1',
        [employee_id]
      );

    if(!workLogs?.length) {
        return res.status(400).json({message: `No Work Logs found for employee: ${employee_id}`});
    }

    res.json(workLogs);
});

const createNewWorkLog = asyncHandler(async (req, res) => {
    const {employee_id, product_id, message} = req.body;

    if(!employee_id || !product_id || !message) {
        res.status(400).json({message: "All Fields Required"});
    }

    const insertQuery = `
    INSERT INTO worklogs (employee_id, product_id, message)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const { rows } = await pool.query(insertQuery, [employee_id, product_id, message]);
  const workLog = rows[0];

    if(workLog) {
        res.status(201).json({messsage: 'New Work Log Created', workLog});
    }
    else {
        res.status(400).json({message: 'Error Creating Work Log'})
    }
});

module.exports = {
    getAllWorkLogs,
    getEmployeeWorkLogs,
    createNewWorkLog,
};