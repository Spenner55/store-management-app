const pool = require('../config/connect');
const bcrypt = require('bcrypt');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).json({message: 'All fields required'});
    }

    const foundResult = await pool.query(
        'SELECT * FROM employees WHERE email = $1', [email]
    )

    const foundEmployee = foundResult.rows[0];

    if(!foundEmployee) {
        return res.status(401).json({message: 'Unauthorized Employee'});
    }

    const match = await bcrypt.compare(password, foundEmployee.password);

    if(!match) {
        return res.status(401).json({message: 'Unauthorized Employee'});
    }

    const accessToken = jwt.sign(
        {
            'UserInfo': {
                'id': foundEmployee.id,
                'email': foundEmployee.email,
                'role': foundEmployee.role,
            },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m'},
    )

    const refreshToken = jwt.sign(
        { 'email': foundEmployee.email,
            'id': foundEmployee.id
         },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' },
    )

    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.json({accessToken});
})

const refresh = (req, res) => {
    const cookies = req.cookies;

    if(!cookies?.jwt) return res.status(401).json({message: 'Unauthorized Refresh'});

    const refreshToken = cookies.jwt;

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async (err, decoded) => {
            if(err) return res.status(403).json({message: 'Forbidden'});

            const foundResult = await pool.query(
                'SELECT email, role FROM employees WHERE email = $1',
                [decoded.email]
            )
            const foundEmployee = foundResult.rows[0];
            
            if(!foundEmployee) return res.status(401).json({message: 'Unauthorized Refresh'});

            const accessToken = jwt.sign(
                {
                    'UserInfo': {
                        'email': foundEmployee.email,
                        'role': foundEmployee.role,
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m'}
            )

            res.json({ accessToken });
        })
    )
}

const logout = (req, res) => {
    const cookies = req.cookies;

    if(!cookies?.jwt) return res.sendStatus(204);

    res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
    })

    res.json({message: 'Cookie cleared'});
}


module.exports = {
    login,
    refresh,
    logout,
}