const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChatroomSchema = new Schema({
  users: { type: Array, required: true, ref: "User" },
  messages: { type: Array, default: [], ref: "Message" },
});

module.exports = mongoose.model("Chatroom", ChatroomSchema);
