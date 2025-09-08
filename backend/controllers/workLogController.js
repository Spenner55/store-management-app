const pool = require('../config/connect');
const asyncHandler = require('express-async-handler');

const getAllWorkLogs = asyncHandler(async (req, res) => {
    const { name } = req.query;

    let text = `
        SELECT
        w.id AS worklog_id, w.employee_id, w.created_at, w.message,
        e.first_name, e.last_name,
        COALESCE(
            JSON_AGG(JSON_BUILD_OBJECT('product_id', i.product_id, 'quantity', i.quantity)
                    ORDER BY i.product_id)
            FILTER (WHERE i.product_id IS NOT NULL),
            '[]'::json
        ) AS items
        FROM public.worklogs w
        JOIN public.employees e ON e.id = w.employee_id
        LEFT JOIN public.worklog_items i ON i.worklog_id = w.id
        GROUP BY w.id, w.employee_id, w.created_at, w.message, e.first_name, e.last_name
    `;

    const values = [];
    const where = [];

    if (name) {
        where.push(`(e.first_name || ' ' || e.last_name) ILIKE $${values.length + 1}`);
        values.push(`%${name}%`);
    }

    if (where.length) {
        text += ` WHERE ${where.join(' AND ')}`;
    }

    text += ` ORDER BY w.id DESC;`;

    const { rows: workLogs } = await pool.query(text, values);
    if (!workLogs?.length) {
        return res.status(400).json({ message: 'No Work Logs Found' });
    }

    res.json(workLogs);
});

const createNewWorkLog = asyncHandler(async (req, res) => {
    const {employee_id, product_id, message} = req.body;

    if(!employee_id || !product_id || !message) {
        return res.status(400).json({message: "All Fields Required"});
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
        res.status(400).json({message: 'Error Creating Work Log'});
    }
});

module.exports = {
    getAllWorkLogs,
    createNewWorkLog,
};