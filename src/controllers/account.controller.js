const accountModel = require("../models/account.model");
const userModel = require("../models/user.model");

async function createAccountController(req, res, next) {
  const user = req.user;
  console.log("User : ", user);

  const account = await accountModel.create({ user: user._id });
  try {
    console.log("Body ", user);
    res.status(200).json({ account, message: "Account created successfully" });
  } catch (err) {
    res.status(500).json({ Error: `Error At create account ${err.message}` });
  }
}

async function getAccountsController(req, res) {
  const userAccountsDetails = await accountModel.find({ user: req.user._id });

  if (!userAccountsDetails) {
    res.status(400).json({ message: "User dont have any accounts" });
  }

  console.log("user accounts", userAccountsDetails);
  return res
    .status(200)
    .json({ message: "Accounts fetched successfully", userAccountsDetails });
}

async function getAccountBalanceController(req, res) {
  const { accountId } = req.params;

  if (!accountId) {
    return res.status(400).json({ message: "Please enter valid account" });
  }

  const userAccount = await accountModel.findOne({
    _id: accountId,
    user: req.user._id,
  });
console.log("userAccount :",userAccount);

  if (!userAccount) {
    res.status(400).json({ message: "Account not found" });
  }
  const accountBalance = await userAccount.getBalance();
  console.log("Balance ",accountBalance);
  
  res.status(200).json({ message: "Balance fetched successfully",
    accountBalance
   });
}

module.exports = { createAccountController, getAccountsController, getAccountBalanceController };
