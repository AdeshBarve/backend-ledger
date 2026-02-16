const express = require("express");

const router = express.Router();

router.post("/register", (req,res) => {
  console.log("Welcome to register page..");
  res.send("Welcome..");
});

module.exports = router;
