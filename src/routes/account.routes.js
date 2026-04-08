const express=require('express');
const { createAccountController, getAccountsController, getAccountBalanceController } = require('../controllers/account.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const router=express.Router();

router.post("/createaccount",authMiddleware,createAccountController);
router.post("/getuseraccounts",authMiddleware,getAccountsController);
router.post("/getaccountsbalance/:accountId",authMiddleware,getAccountBalanceController);



module.exports=router;