const pool = require('../config/connect');
const asyncHandler = require('express-async-handler');

const getInventoryAll = asyncHandler(async (req, res) => {
    const { rows: inventory } = await pool.query(
        `
        SELECT
        id, item_name, description, current_stock, price, department
        FROM inventory
        `
    );

    if(!inventory?.length) {
        return res.status(400).json({message: "No items found in inventory"});
    }

    res.json(inventory);
})

const getInventoryByDepartment = asyncHandler(async (req, res) => {
    const { department } = req.query;

    const { rows: inventory } = await pool.query(
        `
        SELECT
        id, item_name, description, current_stock, price
        FROM inventory
        WHERE department = $1
    `, [department]
    );

    if(!inventory?.length) {
        return res.status(400).json({message: `No Items Found for Department: ${department}`});
    }

    res.json(inventory);
});

const getInventoryByItem = asyncHandler(async (req, res) => {
    const { item_name } = req.query;

    const { rows: inventory } = await pool.query(
        `
        SELECT
        item_id, item_name, current_stock, price
        FROM inventory
        WHERE item_name LIKE $1
    `, [item_name]
    );

    if(!inventory?.length) {
        return res.status(400).json({message: `No Items Found with the name: ${item_name}`});
    }

    res.json(inventory);
});

const createNewItem = asyncHandler(async (req, res) => {
    const { item_name, price, current_stock } = req.params;

    if(!item_name || !price) {
        return res.status(400).json({message: 'name and price must be provided'});
    }

    const { rows } = await pool.query(
        `INSERT INTO inventory (item_name, price, current_stock)
        VALUES ($1, $2, $3)
        RETURNING *`,
    [item_name, price, current_stock]);
    const item = rows[0];

    if(item) {
        res.status(201).json({message: 'New Item Created', item});
    }
    else {
        res.status(400).json({message: 'Error creating item'});
    }
});

const editInventory = asyncHandler(async (req, res) => {

});

module.exports = {
    getInventoryAll,
    getInventoryByDepartment,
    getInventoryByItem,
    createNewItem,
    editInventory
};