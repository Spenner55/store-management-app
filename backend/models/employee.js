const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const employeeSchema = new mongoose.Schema({
  uuid: {
    type: String,
    //auto generate unique user ID
    default: uuidv4,
  },
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  department: {
    type: String,
  },
  role: {
    type: String,
    default: "Employee"
  },
  wage: {
    type: Number,
    default: 15
  }
});

module.exports = mongoose.model('Employee', employeeSchema)