const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    fromAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: [true, "Transaction must be associate with a From account"],
      index: true,
    },
    toAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: [true, "Transaction must be associate with a To account"],
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: ["PENDING", "COMPLETED", "REVERSED", "FAILED"],
        message: [
          "Status can be either PENDING, COMPLETED, FAILED OR REVERSED",
        ],
      },
      default: "PENDING",
    },
    amount: {
      type: Number,
      required: [true, "Amount is required to create the transaction"],
      min: [0, "Amount need to be greater than 0"],
    },
    idempotencyKey: {
      type: String,
      required: [true, "IdempotencyKey is required to create a transactionn"],
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

const transactionModel = mongoose.model("transaction",transactionSchema);

module.exports = transactionModel;
