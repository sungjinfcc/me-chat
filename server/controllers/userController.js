const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const asyncHandler = require("express-async-handler");

const User = require("../models/user");

exports.login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username: username });

  if (!user) {
    return res.status(400).json({
      message: "No user found",
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({
      message: "Wrong password",
    });
  }

  jwt.sign(
    { _id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "24h" },
    (err, token) => {
      if (err) return res.status(400).json(err);

      res.json({
        token,
        user: user.username,
        message: "Login successful!",
      });
    }
  );
});

exports.signup = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username: username });

  if (user) {
    return res
      .status(400)
      .json({ message: "User with this username already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    username: username,
    password: hashedPassword,
  });

  jwt.sign(
    { _id: newUser._id, username: newUser.username },
    process.env.JWT_SECRET,
    { expiresIn: "24h" },
    (err, token) => {
      if (err) console.log(err);

      res.status(200).json({
        token,
        user: newUser.username,
        message: "Signed in correctly!",
      });
    }
  );
});
