const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const worklogSchema = new mongoose.Schema({
    uuid: {
        type: String,
        default: uuidv4,
    },
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    createAt: {
        type: Date,
        default: Date.now,
    }
});

worklogSchema.pre(/^find/, function(next) {
    this.populate('employeeId', 'first_name last_name');
    next();
});

module.exports = mongoose.model('WorkLog', worklogSchema);