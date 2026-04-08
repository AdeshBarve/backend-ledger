const cookieParser = require("cookie-parser");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { sendRegisterMail } = require("../config/sendregistermail");
const tokenBlacklistModel = require("../models/tokenBlacklist.model");

async function authUserRegister(req, res) {
  const { name, email, password } = req.body;
  try {
    const isUserExist = await userModel.findOne({ email: email });
    console.log("User ,", isUserExist);

    if (isUserExist) {
      return res.send({ Message: "User is already exist" });
    }

    const user = await userModel.create({
      name,
      email,
      password,
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    sendRegisterMail(email, name);
    res.cookie("token", token);
    return res.status(201).json({
      message: "User created successfully",
      status: "Success",
      token: token,
    });
  } catch (error) {
    console.log("Error at authUserRegister : ", error.message);
    res.status(400).json({ message: error.message });
  }
}

async function authLoginController(req, res) {
  const { email, password } = req.body;

  try {
    const user = await userModel
      .findOne({
        email,
      })
      .select("+password");
    console.log("User :", user);

    if (!user) {
      console.log("isValid ", user);

      return res
        .status(401)
        .json({ message: "Enter valid username or password" });
    }

    const isValid = await user.comparePassword(password);
    console.log("isValid ", isValid);

    if (isValid) {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      res.cookie("token", token);
      return res.status(200).json({
        user: { _id: user._id, email: user.email, name: user.name },
        token: token,
      });
    }
  } catch (error) {
    console.log("Error At authLoginController: ", error.Message);

    res.status(500).json({
      error: error.message,
    });
  }
}

async function authLogoutController(req, res) {
  const { token } = req.cookies;

  if (!token) {
    return res.status(200).json({ message: "User logged out successfully" });
  }

  const decode = jwt.decode(token);
  console.log("Decode Exp :", decode);

  res.clearCookie("token");
  const blackListToken = await tokenBlacklistModel.create({
    token: token,
    expiresAt: new Date(decode.exp * 1000),
  });

  return res.status(200).json({ message: "User logged out successfully" });
}

module.exports = {
  authUserRegister,
  authLoginController,
  authLogoutController,
};
