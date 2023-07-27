const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

const Chatroom = require("../models/chatroom");

exports.get_chatrooms = asyncHandler(async (req, res, next) => {
  const allRooms = await Chatroom.find()
    .populate("users")
    .populate("messages")
    .exec();

  res.json(allRooms);
});

exports.create_chatroom = [
  body("receiver")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Receiver is required"),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
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
      title: `Chat between ${senderID}, ${receiverID}`,
    });

    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: errors.array()[0],
      });
    } else {
      await chatroom.save();
      return res.json({
        message: "Chatroom created",
      });
    }
  }),
];

exports.update_chatroom = [
  body("title")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Title field is required"),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const chatRoom = await Chatroom.findById(req.params.chatroom_id)
      .populate("users")
      .populate("messages")
      .exec();

    if (!chatRoom) {
      return res.status(404).json({
        message: "Chatroom not found",
      });
    }

    chatRoom.title = req.body.title;

    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: errors.array()[0],
      });
    } else {
      await chatRoom.save();
      return res.json({
        message: "Chatroom title updated",
      });
    }
  }),
];

exports.delete_chatroom = asyncHandler(async (req, res, next) => {
  await Chatroom.findByIdAndRemove(req.params.chatroom_id);
  return res.json({ message: "Succesfully deleted" });
});
