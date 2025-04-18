const pool = require('../config/connect');
const asyncHandler = require('express-async-handler');

const getAllWorkLogs = asyncHandler(async (req, res) => {
    const { name } = req.query;

    let text = `
        SELECT 
        w.worklog_id           AS "worklog_id",
        w.product_id           AS "product_id",
        w.created_at           AS "created_at",
        w.message              AS "message",
        e.employee_id          AS "employee_id",
        e.first_name           AS "first_name",
        e.last_name            AS "last_name"
        FROM worklogs w
        JOIN employees e ON e.employee_id = w.employee_id
    `;

    const values = [];

    if (name) {
        text += `WHERE (e.first_name || ' ' || e.last_name) ILIKE $1`;
        values.push(`%${name}%`);
    }
    text += ' ORDER BY w.worklog_id DESC';

    const { rows: workLogs } = await pool.query(text, values);

    if(!workLogs?.length) {
        return res.status(400).json({message: 'No Work Logs Found'});
    }

    res.json(workLogs);
});

const getEmployeeWorkLogs = asyncHandler(async (req, res) => {
    const {employee_id} = req.params;
    
    const { rows: workLogs } = await pool.query(
        `SELECT
        w.worklog_id           AS "worklog_id",
        w.product_id           AS "product_id",
        w.created_at           AS "created_at",
        w.message              AS "message",
        e.employee_id          AS "employee_id",
        e.first_name           AS "first_name",
        e.last_name            AS "last_name"
        FROM worklogs w 
        JOIN employees e ON e.employee_id = w.employee_id
        WHERE w.employee_id = $1`,
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