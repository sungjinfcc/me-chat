const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  chatroom: { type: Schema.Types.ObjectId, required: true, ref: "Chatroom" },
});

module.exports = mongoose.model("Message", MessageSchema);
