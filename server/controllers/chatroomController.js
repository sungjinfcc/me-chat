const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

const Chatroom = require("../models/chatroom");

exports.get_chatrooms = asyncHandler(async (req, res, next) => {
  const allRooms = await Chatroom.find().populate("messages").exec();

  res.json(allRooms);
});

exports.create_chatroom = [
  asyncHandler(async (req, res, next) => {
    const receiverID = req.body.receiver;
    const senderID = req.user._id;

    const existingChatroom = await Chatroom.findOne({
      users: { $all: [senderID, receiverID] },
    });

    if (existingChatroom) {
      return res.status(400).json({
        message: "Chatroom with the same users already exists.",
      });
    }
    const chatroom = new Chatroom({
      users: [senderID, receiverID],
      title: `Chat - ${receiverID}`,
    });

    await chatroom.save();
    return res.json({
      id: chatroom._id,
      message: "Chatroom created",
    });
  }),
];

exports.delete_chatroom = asyncHandler(async (req, res, next) => {
  await Chatroom.findByIdAndRemove(req.params.chatroom_id);
  return res.json({ message: "Succesfully deleted" });
});
