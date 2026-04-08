const mongoose = require("mongoose");

const ledgerSchema = new mongoose.Schema(
  {
    transaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "transaction",
      required: [true, "Transaction is required to create ledger"],
      immutable: true,
      index: true,
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: [true, "Account required to create the ledger"],
      immutable: true,
      index: true,
    },
    type: {
      type: String,
      enum: {
        values: ["CREDIT", "DEBIT"],
        message: ["Type can be either CREDIT Or DEBIT"],
      },
      required: [true, "Type is required to create ledger"],
      immutable: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount required to create the ledger"],
      min: [0, "Amount cannot be negative"],
      immutable: true,
    },
  },
  {
    timestamps: true,
  },
);

function preventLedgerModification() {
  throw new Error("Ledger are immutable and cannot be modified or deleted");
}

ledgerSchema.pre("updateOne", preventLedgerModification);
ledgerSchema.pre("findOneAndUpdate", preventLedgerModification);
ledgerSchema.pre("deleteOne", preventLedgerModification);
ledgerSchema.pre("remove", preventLedgerModification);
ledgerSchema.pre("deleteMany", preventLedgerModification);
ledgerSchema.pre("updateMany", preventLedgerModification);
ledgerSchema.pre("findOneAndDelete", preventLedgerModification);
ledgerSchema.pre("findOneAndReplace", preventLedgerModification);

const ledgerModel = mongoose.model("ledger", ledgerSchema);

module.exports = ledgerModel;
