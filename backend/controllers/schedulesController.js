const pool = require('../config/connect');
const asyncHandler = require('express-async-handler');
const { getDefaultDateWindow } = require('../utils/dateWindow');

const getMyShifts = asyncHandler(async(req, res) => {
    const { from, to } = getDefaultDateWindow(req);
    const { rows: shifts } = await pool.query(
        `
        SELECT * FROM shifts
        WHERE employee_id = $1
        AND ($2::timestamptz IS NULL OR start_at >= $2)
        AND ($3::timestamptz IS NULL OR end_at < $3)
        ORDER BY start_at
        `,
        [req.user.id, from ?? null, to ?? null]
    );

    if(!shifts?.length) {
        return res.status(400).json({ message: `No shifts for employee id ${employee_id} between ${from} and ${to} found`});
    }

    res.json(shifts);

});

const getAllShifts = asyncHandler(async(req, res) => {
    const { from, to } = getDefaultDateWindow(req);
    const { rows: shifts } = await pool.query(
        `
        SELECT * FROM shifts
        WHERE ($1::timestamptz is NULL OR start_at >= $1)
        AND ($2::timestamptz is NULL OR end_at < $2)
        ORDER BY start_at
        `,
        [from ?? null, to ?? null]
    );
    if(!shifts?.length) {
        return res.status(400).json({ message: `No shifts between ${from} and ${to} found`});
    }

    res.json(shifts);

});

const createNewShift = asyncHandler(async(req, res) => {
    const { employee_id, start_at, end_at, role_label, status} = req.body;

    if(!employee_id || !start_at || !end_at) {
        return res.status(400).json({ message: "All fields (employee_id, start_at, end_at) required"});
    }
    try {
        const { rows } = await pool.query(
        `
        INSERT INTO shifts (employee_id, start_at, end_at, role_label, status)
        VALUES ($1, $2, $3, 
            COALESCE(NULLIF($4, ''), 'Pending Placement'),
            COALESCE(NULLIF($5, ''), 'published'))
        RETURNING *
        `, [employee_id, start_at, end_at, role_label ?? null, status ?? null]
    );

    res.status(201).json(rows[0]);

    } catch (err) {
        switch(err.code) {
            case '23514': { // CHECK constraint
                if (err.constraint === 'shifts_status_check') {
                return res.status(422).json({
                    message: "Invalid 'status'. Allowed: 'draft', 'published', 'cancelled'."
                });
                }
                if (err.constraint === 'shifts_check') {
                return res.status(422).json({
                    message: "'end_at' must be after 'start_at'."
                });
                }
                return res.status(422).json({ message: "Check constraint violated." });
            }
            case '23503': { // FK
                if (err.constraint === 'shifts_employee_id_fkey') {
                return res.status(422).json({ message: "employee_id does not exist." });
                }
                return res.status(422).json({ message: "Foreign key constraint violated." });
            }
            case '23505': // unique
                return res.status(409).json({ message: "Duplicate value violates unique constraint." });
            case '23502': // not-null
                return res.status(422).json({ message: `Missing required field: ${err.column}` });
            case '22008':
                return res.status(422).json({ message: "Invalid date/time format." });
            default:
                console.error('DB error:', err);
                return res.status(500).json({ message: "Internal database error.", code: err.code });
        }
    }
});

const updateShift = asyncHandler(async(req, res) => {
    const id = req.params.id;

    if(!id) {
        return res.status(400).json({ message: "missing id"});
    }
    const { start_at, end_at, role_label, status } = req.body;

    if(!start_at || !end_at) {
        return res.status(400).json({ message: "start_at, end_at are required"});
    }

    const { rows } = await pool.query(
        `
        UPDATE shifts
            SET 
                start_at=$2, 
                end_at=$3, 
                role_label=COALESCE(NULLIF($4, ''), 'Pending Placement'), 
                status=COALESCE(NULLIF($5, ''), 'published'), 
                updated_at=NOW()
        WHERE id=$1 RETURNING *
        `, [id, start_at, end_at, role_label ?? null, status ?? null]
    );

    const shift = rows[0];
    if(!shift) {
        return res.status(404).json({ message: "Failed to find shift"});
    }

    return res.json(shift);
});

const deleteShift = asyncHandler(async(req, res) => {
    const id = req.params.id;
    if(!id) {
        return res.status(400).json({ message: "missing id"});
    }
    const { rows } = await pool.query(
        `
        DELETE FROM shifts WHERE id=$1
        `, [id]
    );

    const deletedShift = rows[0];

    if(!deletedShift) {
        return res.status(404).json({ message: `No shift with id: ${id} found to delete`})
    }

    res.sendStatus(204);
});

module.exports = {
    getMyShifts,
    getAllShifts,
    createNewShift,
    updateShift,
    deleteShift
};