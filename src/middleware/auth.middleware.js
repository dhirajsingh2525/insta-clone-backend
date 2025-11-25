const userModel = require("../models/user.model");
const redisClient = require("../services/chache.services");
const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(404).json({
        message: "Token not found",
      });
    }

    const blacklisted = await redisClient.get(token);

    if (blacklisted) {
      return res.status(401).json({
        message: "Token blacklisted or expired",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "Token expired",
        });
      } else if (err.name === "JsonWebTokenError") {
        return res.status(403).json({
          message: "Invalid token",
        });
      } else {
        throw err; 
      }
    }

    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    req.user = user;
    next();

  } catch (error) {
    console.log("JWT Middleware Error:", error);
    return res.status(500).json({
      message: "Internal server error in auth middleware",
    });
  }
};

module.exports = authMiddleware;


