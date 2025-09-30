require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const {logger, logEvents } = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const corsOptions = require('./config/corsOptions');
const PORT = process.env.PORT || 5000;
const pool = require('./config/connect');


app.use(logger);

app.use(cors(corsOptions));

app.use(cookieParser());

app.use(express.json());

app.use('/', express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/root'));

app.use('/auth', require('./routes/authRoute'));
app.use('/employees', require('./routes/employeeRoutes'));
app.use('/worklogs', require('./routes/workLogRoute'));
app.use('/inventory', require('./routes/inventoryRoute'));
app.use('/sales', require('./routes/salesRoute'));
app.use('/schedule', require('./routes/schedulesRoutes'));

app.use(errorHandler);

app.all('*', (req, res) => {
  res.status(404)
  if (req.accepts('html')) {
      res.sendFile(path.join(__dirname, 'views', '404.html'))
  } else if (req.accepts('json')) {
      res.json({ message: '404 Not Found' })
  } else {
      res.type('txt').send('404 Not Found')
  }
});

pool.connect()
  .then(() => {
    console.log('Connected to PostgreSQL');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('PostgreSQL connection error:', err)
    process.exit(1);
  });
