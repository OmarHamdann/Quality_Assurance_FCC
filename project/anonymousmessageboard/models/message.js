const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  text: { type: String, required: true },
  reported: { type: Boolean, required: true, default: false },
  delete_password: { type: String, required: true },
  replycount: { type: Number, default: 0 },
  replies: [Object],
  bumped_on: Date,
  created_on: Date
});

module.exports = mongoose.model("message", messageSchema);