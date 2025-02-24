const mongoose = require('mongoose');

const worklogSchema = new mongoose.Schema({
    employee: {
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
    this.populate('employee', 'first_name last_name');
    next();
});

module.exports = mongoose.model('WorkLog', worklogSchema);