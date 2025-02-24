const Employee = require('../models/employee');
const bcrypt = require('bcrypt');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).json({message: 'All fields required'});
    }

    const foundEmployee = await Employee.findOne({ email }).exec();

    if(!foundEmployee) {
        return res.status(401).json({message: 'Unauthorized'});
    }

    const match = await bcrypt.compare(password, foundEmployee.password);

    if(!match) return res.status(401).json({message: 'Unauthorized'});

    const accessToken = jwt.sign(
        {
            'UserInfo': {
                'email': foundEmployee.email,
                'role': foundEmployee.role,
            },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m'},
    )

    res.json({accessToken});
})

module.exports = {
    login,
    //add logout later with cookies
}