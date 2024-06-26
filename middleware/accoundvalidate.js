const jwt = require("jsonwebtoken");
require("dotenv").config();

const accountMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
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

const adminMiddleware = (req, res, next) => {
  if (req.role === "admin" || req.role === "superAdmin") {
    next();
  } else {
    res.status(403).json({ success: false, msg: "Access denied, admin only" });
  }
};

const superadminMiddleware = (req, res, next) => {
  if (req.role === "superAdmin") {
    next();
  } else {
    res
      .status(403)
      .json({ success: false, msg: "Access denied, superAdmin only" });
  }
};

module.exports = { accountMiddleware, adminMiddleware, superadminMiddleware };
