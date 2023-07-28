const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

const Message = require("../models/message");
const Chatroom = require("../models/chatroom");

exports.get_messages = asyncHandler(async (req, res, next) => {
  const allMessages = await Message.find({ chatroom: req.params.chatroom_id })
    .populate("user")
    .populate("chatroom")
    .sort({ timestamp: 1 })
    .exec();

  res.json(allMessages);
});

exports.create_message = [
  body("message", "Message field is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const newMessage = new Message({
      user: req.user._id,
      message: req.body.message,
      chatroom: req.params.chatroom_id,
    });

    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: errors.array()[0],
      });
    } else {
      await newMessage.save();
      return res.json({
        message: "Message created",
      });
    }
  }),
];
