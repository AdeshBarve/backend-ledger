const express = require("express");
const register = require("../controllers/userController");
const { authUserRegister, authLoginController, authLogoutController } = require("../controllers/auth.controller");
const { authMiddleware, authLogoutMiddleware } = require("../middleware/auth.middleware");


const router = express.Router();

router.post("/register",authUserRegister);
router.post("/login",authLoginController);
router.post("/logout",authLogoutController, authLogoutMiddleware);

module.exports = router;
