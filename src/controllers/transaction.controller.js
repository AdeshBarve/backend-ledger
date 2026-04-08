const transactionModel = require("../models/transaction.model");
const accountModel = require("../models/account.model");
const ledgerModel = require("../models/ledger.model");
const { sendTransactionMail } = require("../services/email.service");
const mongoose = require("mongoose");
const userModel = require("../models/user.model");

async function createTransaction(req, res) {
  const { fromAccount, toAccount, idempotencyKey, amount } = req.body;
  console.log("Body transaction :", req.body);

  try {
    if (!fromAccount || !toAccount || !idempotencyKey || !amount) {
      res
        .status(400)
        .json({ message: "All information is required to do transaction" });
    }

    const fromUserAccount = await accountModel.findOne({ _id: fromAccount });
    const toUserAccount = await accountModel.findOne({ _id: toAccount });

    console.log("From user account :", fromUserAccount);
    console.log("To user account :", toUserAccount.status);

    if (!fromUserAccount || !toUserAccount) {
      res.status(400).json({ message: "From or To account is not valid" });
    }

    if (
      fromUserAccount.status != "ACTIVE" ||
      toUserAccount.status != "ACTIVE"
    ) {
      return res.status(400).json({
        message:
          "Both From and To user account must be active to process transaction",
      });
    }
    const isTransactionAlreadyExist = await transactionModel.findOne({
      idempotencyKey,
    });

    console.log("IdempotencyKey :", idempotencyKey);
    console.log("IdempotencyKey Status:", idempotencyKey?.status);
    
    if (idempotencyKey) {
      if (isTransactionAlreadyExist?.status == "PENDING") {
        return res
          .status(200)
          .json({ message: "Transaction is still processing" });
      }
      if (isTransactionAlreadyExist?.status == "COMPLETED") {
        return res
          .status(200)
          .json({ message: "transaction is already completed" });
      }
      if (isTransactionAlreadyExist?.status == "FAILED") {
        return res
          .status(500)
          .json({ message: "Transaction was failed, Please retry" });
      }
      if (isTransactionAlreadyExist?.status == "REVERSED") {
        return res
          .status(500)
          .json({ message: "transaction was reversed, Please retry" });
      }
    }
    const balance = await fromUserAccount.getBalance();
    console.log("Balance :", balance, "Amount :", amount);

    if (balance < amount) {
      return res
        .status(400)
        .json({ message: `Low Balance, you only have ${balance} ` });
    }

    const session = await mongoose.startSession();

    session.startTransaction();

    const [transaction] = await transactionModel.create(
      [
        {
          fromAccount,
          toAccount,
          idempotencyKey,
          amount,
          status: "PENDING",
        },
      ],
      { session },
    );

    console.log("TransactionId ", transaction._id);

    const creditLedger = await ledgerModel.create(
      [
        {
          transaction: transaction._id,
          account: toAccount,
          type: "CREDIT",
          amount: amount,
        },
      ],
      { session },
    );

    await (() => {
      return new Promise((resolve) => setTimeout(resolve, 100 * 1000));
    })();

    const debitLedger = await ledgerModel.create(
      [
        {
          transaction: transaction._id,
          account: fromAccount,
          type: "DEBIT",
          amount: amount,
        },
      ],
      { session },
    );

    const updateTransactionStatus = await transactionModel.findOneAndUpdate(
      { _id: transaction._id },
      {
        status: "COMPLETED",
      },

      { session, returnDocument: "after" },
    );

    console.log("update Transaction :", updateTransactionStatus);

    // transaction.status = "COMPLETED";

    // // await transaction.save({ session });

    await session.commitTransaction();
    session.endSession();

    sendTransactionMail(req.user.email, req.user.name, fromAccount, toAccount);

    res.status(201).json({
      message: "Transaction created successfully",
      updateTransactionStatus,
    });
  } catch (err) {
    res.status(500).json({ message: "Transaction is pending due to some issue, Please retry after some time" });
    console.log("Error at transaction controller ", err.message);
  }
}

async function createInitialFundsTransaction(req, res) {
  const { toAccount, amount, idempotencyKey } = req.body;

  if (!toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({ message: "All information is required" });
  }

  const toUserAccount = await accountModel.findOne({ _id: toAccount });
  if (!toAccount) {
    res.status(400).json({ message: "Invalid to account" });
  }
  const isIdempotencyKeyAvailable = await ledgerModel.findOne({
    idempotencyKey,
  });

  if (isIdempotencyKeyAvailable) {
    if (isIdempotencyKeyAvailable.status === "PENDING") {
      return res.status(400).json({ message: "ledger is still in pending" });
    }
    if (isIdempotencyKeyAvailable.status === "COMPLETE") {
      return res.status(400).json({ message: "Ledger is already completed" });
    }
    if (isIdempotencyKeyAvailable === "FAILED") {
      return res.staus(400).json({ message: "ledger is failed, please retry" });
    }
  }

  const systemUser = await userModel.findOne({
    _id: req.user._id,
    systemUser: true,
  });
  if (!systemUser) {
    return res.status(400).json({ message: "system user account canot find" });
  }
  const session = await mongoose.startSession();
  session.startTransaction();

  const [transaction] = await transactionModel.create(
    [
      {
        fromAccount: systemUser._id,
        toAccount: toAccount,
        status: "PENDING",
        amount: amount,
        idempotencyKey: idempotencyKey,
      },
    ],
    { session },
  );

  console.log("Transaction Data :", transaction);

  const creditLedgerEntry = await ledgerModel.create(
    [
      {
        transaction: transaction._id,
        account: toUserAccount._id,
        amount,
        type: "CREDIT",
      },
    ],
    { session },
  );
  const debitledgerEntry = await ledgerModel.create(
    [
      {
        transaction: transaction._id,
        account: systemUser._id,
        amount,
        type: "DEBIT",
      },
    ],
    { session },
  );

  transaction.status = "COMPLETED";
  await transaction.save({ session });

  await session.commitTransaction();

  session.endSession();
  return res
    .status(201)
    .json({ message: "Initial funds transaction created successfully" });
}

module.exports = { createTransaction, createInitialFundsTransaction };
