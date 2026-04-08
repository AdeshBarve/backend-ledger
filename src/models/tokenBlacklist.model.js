const mongoose = require("mongoose");

const tokenBlacklistSchema = new mongoose.Schema({
  token: { type: String, required: [true, "Token is required to blacklis"] },
  expiresAt: {
    type: Date,
    required: true,
  },
});

tokenBlacklistSchema.index({ expiredAt: -1 }, { expiresAfterSeconds: 0 });

module.exports = mongoose.model("tokenBlacklist", tokenBlacklistSchema);
