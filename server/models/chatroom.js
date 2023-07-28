const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChatroomSchema = new Schema({
  users: { type: Array, required: true },
  messages: { type: Array, default: [], ref: "Message" },
  title: { type: String, required: true },
});

module.exports = mongoose.model("Chatroom", ChatroomSchema);
