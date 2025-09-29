const pool = require('../config/connect');
const asyncHandler = require('express-async-handler');

const getAllSales = asyncHandler(async (req, res) => {
    const { rows: sales } = await pool.query(
        `
        SELECT
        id, item_id, item_name, receipt_id, quantity_sold, price, refunded_qty, date_sold
        FROM sales
        `
    );
    if(!sales?.length) {
        return res.status(400).json({ message: 'No sales records found in sales'});
    }

    res.json(sales);
});

const createReceipt = asyncHandler(async (req, res) => {
  const { items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'No items provided' });
  }

  try {
    await pool.query('BEGIN');

    const { rows: receiptRows } = await pool.query(
      `INSERT INTO receipts DEFAULT VALUES RETURNING *`
    );
    const receipt = receiptRows[0];

    const sales = [];
    for (const item of items) {
      const { item_id, item_name, quantity_sold, price } = item;

      if (!item_id || !quantity_sold) {
        throw new Error('Missing required fields in one of the items');
      }

      const { rows } = await pool.query(
        `
        INSERT INTO sales (item_id, item_name, receipt_id, quantity_sold, price)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
        `,
        [item_id, item_name, receipt.id, quantity_sold, price]
      );

      sales.push(rows[0]);
    }

    await pool.query('COMMIT');

    res.status(201).json({
      message: 'Receipt created successfully',
      receipt,
      sales,
    });
  } catch (error) {
    await pool.query('ROLLBACK');
    res.status(500).json({ message: error.message });
  }
});

module.exports = {
    getAllSales,
    createReceipt
};