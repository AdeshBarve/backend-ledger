const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const tokenBlacklistModel = require("../models/tokenBlacklist.model");

async function authMiddleware(req, res, next) {
  const token = req.cookies.token || req.headers.authorizations?.split(" ")[1];
  console.log("Token :", token);

  try {
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized access, token is missing",
      });
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded :", decoded.userId);
    const user = await userModel.findOne({ _id: decoded.userId });
    console.log("User Middleware ", user);
    req.user = user;
    if (user) {
      next();
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: `Error at authentication : ${err.message}` });
  }
}

async function authSystemUserMiddleware(req, res, next) {
  const token = req.cookies.token || req.headers.authorizations?.split(" ")[1];
  console.log("Token :", token);
  try {
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized access, token is missing",
      });
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded :", decoded.userId);
    const user = await userModel
      .findOne({ _id: decoded.userId })
      .select("+systemUser");
    if (!user.systemUser) {
      res.status(400).json({ message: "Forbidden access, not a system user" });
    }
    req.user = user;
    next();
  } catch (err) {
    res
      .status(500)
      .json({ message: `Error at authentication : ${err.message}` });
  }
}

async function authLogoutMiddleware(req, res, next) {
  const token = req.cookies.token || req.headers.authorizations?.split(" ")[1];
  console.log("Middlewar Token :", token);
  if (!token) {
    return res.status(200).json({ message: "User Logged Out Successfully" });
  }

  const isTokenBlacklisted = await tokenBlacklistModel.findOne({
    token: token,
  });
  console.log("Logout Middleware token :",isTokenBlacklisted);

  if (isTokenBlacklisted) {
    return res.status(200).json({ message: "Token expired or logged out" });
  }
}

module.exports = {
  authMiddleware,
  authSystemUserMiddleware,
  authLogoutMiddleware,
};
