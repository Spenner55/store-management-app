module.exports = (...allowed) => (req, res, next) => {
  // assume req.user.role is set by your verifyJWT middleware
  return allowed.includes(req.user?.role)
    ? next()
    : res.sendStatus(403);
};