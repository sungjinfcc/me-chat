var express = require("express");
var router = express.Router();
const authenticateToken = require("../middlewares/authenticateToken");

const chatroom_controller = require("../controllers/chatroomController");
const message_controller = require("../controllers/messageController");
const user_controller = require("../controllers/userController");

// Auth
router.get("/users", authenticateToken, user_controller.get_users);
router.post("/user/login", user_controller.login);
router.post("/user/signup", user_controller.signup);
router.put(
  "/user/:user_id/update",
  authenticateToken,
  user_controller.update_name
);

// Chatroom
router.get("/chatrooms", chatroom_controller.get_chatrooms);
router.post(
  "/chatroom/create",
  authenticateToken,
  chatroom_controller.create_chatroom
);
router.delete(
  "/chatroom/:chatroom_id/delete",
  authenticateToken,
  chatroom_controller.delete_chatroom
);

// Message
router.get("/chatroom/:chatroom_id/messages", message_controller.get_messages);
router.post(
  "/chatroom/:chatroom_id/message/create",
  authenticateToken,
  message_controller.create_message
);

module.exports = router;
