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
    const {message, items} = req.body;

    const employee_id = req.user.id;

    if(!employee_id || !message) {
        return res.status(400).json({message: "employee_id and message are required"});
    }

    const safeItems = Array.isArray(items) ? items
        .filter(i => i && Number.isInteger(i.product_id) && Number.isInteger(i.quantity))
        .map(i => ({ product_id: i.product_id, quantity: i.quantity }))
    : [];

    const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const insertWorklogSQL = `
      INSERT INTO public.worklogs (employee_id, message)
      VALUES ($1, $2)
      RETURNING id, employee_id, message, created_at
    `;
    const { rows: [w] } = await client.query(insertWorklogSQL, [employee_id, message]);

    if (safeItems.length) {
      const products = safeItems.map(i => i.product_id);
      const quantities = safeItems.map(i => i.quantity);

      const insertItemsSQL = `
        INSERT INTO public.worklog_items (worklog_id, product_id, quantity)
        SELECT $1, p, q
        FROM UNNEST($2::int[], $3::int[]) AS t(p, q)
      `;
      await client.query(insertItemsSQL, [w.id, products, quantities]);

      const updateInventorySQL = `
        UPDATE public.inventory inv
        SET current_stock = inv.current_stock + t.qty
        FROM (
          SELECT UNNEST($1::int[]) AS id, UNNEST($2::int[]) AS qty
        ) AS t
        WHERE inv.id = t.id
      `;
      await client.query(updateInventorySQL, [products, quantities]);

      const missingSQL = `
        SELECT p AS missing_id
        FROM UNNEST($1::int[]) p
        LEFT JOIN public.inventory inv ON inv.id = p
        WHERE inv.id IS NULL
      `;
      const { rows: missing } = await client.query(missingSQL, [products]);
      if (missing.length) {
        throw new Error(`Unknown product_id(s) in inventory: ${missing.map(r => r.missing_id).join(', ')}`);
      }
    }

    await client.query('COMMIT');
    return res.status(201).json({
      message: 'New Work Log Created',
      worklog_id: w.id
    });
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
});

module.exports = {
    getAllWorkLogs,
    createNewWorkLog,
};