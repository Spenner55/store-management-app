const employee = require('../models/employee');
const WorkLog = require('../models/workLog');
const asyncHandler = require('express-async-handler');

const getAllWorkLogs = asyncHandler(async (res, req) => {
    const workLogs = await WorkLog.find().lean();

    if(!workLogs?.length) {
        return res.status(400).json({message: 'No Work Logs Found'});
    }

    res.json(workLogs);
});

const getEmployeeWorkLogs = asyncHandler(async (res, req) => {
    const {employee} = req.params;
    const workLogs = await WorkLog.find({employee}).lean();

    if(!workLogs?.length) {
        return res.status(400).json({message: `No Work Logs found for employee: ${employee}`});
    }

    res.jason(workLogs);
});

const createNewWorkLog = asyncHandler(async (res, req) => {
    const {employee, content} = req.body;

    if(!employee || !content) {
        res.status(400).json({message: "All Fields Required"});
    }

    const workLog = await WorkLog.create({employee, content});

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