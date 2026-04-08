const express=require('express');
const { authMiddleware, authSystemUserMiddleware } = require('../middleware/auth.middleware');
const {createTransaction, createInitialFundsTransaction} = require('../controllers/transaction.controller');

const transactionRoutes=express.Router()

transactionRoutes.post('/createtransaction',authMiddleware,createTransaction);
transactionRoutes.post('/system/initial-funds',authSystemUserMiddleware,createInitialFundsTransaction);




module.exports=transactionRoutes;