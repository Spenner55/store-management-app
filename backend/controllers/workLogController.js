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
    const {employeeId} = req.params;
    const workLogs = await WorkLog.find({employeeId}).lean();

    if(!workLogs?.length) {
        return res.status(400).json({message: `No Work Logs found for employeeId: ${employeeId}`});
    }

    res.jason(workLogs);
});

const createNewWorkLog = asyncHandler(async (res, req) => {
    const {employeeId, content} = req.body;

    if(!employeeId || !content) {
        res.status(400).json({message: "All Fields Required"});
    }

    const workLog = await WorkLog.create({employeeId, content});

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