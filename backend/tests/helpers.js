const express = require('express');
const cookieParser = require('cookie-parser');

// Minimal app builder that mounts your real routers
function buildApp({ 
  mountAuth = false, 
  mountInventory = false, 
  mountEmployee = false, 
  mountWorkLog = false,
  mountSchedule = false,
  mountSales = false,
} = {}) {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  if (mountAuth) {
    app.use('/auth', require('../routes/authRoute'));           // uses loginLimiter + controller :contentReference[oaicite:5]{index=5}
  }
  if (mountInventory) {
    app.use('/inventory', require('../routes/inventoryRoute')); // uses verifyJWT + controller  :contentReference[oaicite:6]{index=6}
  }
  if(mountEmployee) {
    app.use('/employee', require('../routes/employeeRoutes'));
  }
  if(mountWorkLog) {
    app.use('/worklog', require('../routes/workLogRoutes'));
  }
  if(mountSchedule) {
    app.use('/schedule', require('../routes/scheduleRoutes'));
  }
  if(mountSales) {
    app.use('/sales', require('../routes/salesRoutes'));
  }
  return app;
}

module.exports = { buildApp };