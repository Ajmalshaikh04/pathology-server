const jwt = require("jsonwebtoken");
require("dotenv").config();

const accountMiddleware = (req, res, next) => {
  console.log(req.body);
  const token =
    req?.headers?.authorization || req?.body?.headers?.authorization;
  console.log("TOKEN>>>>", token);
  try {
    if (token) {
      const { _id, role } = jwt.verify(token, process.env.JWT_SECRET_KEY);
      if (_id) {
        req.account = _id;
        req.role = role;
        console.log(_id, role);
        next();
      }
    } else {
      res
        .status(401)
        .json({ success: false, msg: "Token expired, access denied" });
    }
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (allowedRoles.includes(req.role)) {
      next();
    } else {
      res.status(403).json({
        success: false,
        msg: `Access denied, allowed roles: ${allowedRoles.join(", ")}`,
      });
    }
  };
};

module.exports = {
  accountMiddleware,
  roleMiddleware,
};
