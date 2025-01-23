const jwt = require("jsonwebtoken");
const Messages = require("../models/messageModel");
const User = require("../models/userModel");
require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});

const sendMessages = async (req, res) => {
  try {
    const { message_content, receiver_id } = req.body;
    const token = req.headers.authorization?.split(" ")[1];

    //Validate input
    if (!message_content || !token) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //Decode the JWT Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const sender_id = decoded.id;

    //Ensure sender exists
    const sender = await User.findByPk(sender_id);
    if (!sender) {
      return res.status(404).json({ message: "Sender not found" });
    }

    //Ensure receiver exists
    const receiver = await User.findByPk(receiver_id);
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    //Create the message
    const newMessage = await Messages.create({
      message_content,
      sender_id,
      receiver_id,
    });

    const io = req.app.get("io");

    //brodcast the message to connected clients
    io.emit("newMessage", newMessage);

    res
      .status(201)
      .json({ message: "Message sent successfully", data: newMessage });
  } catch (error) {
    console.error("Error in sendMessages: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const receiveMessages = async (req, res) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    //Decode the JWT Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id: userId, role } = decoded;

    //Define the condition
    let whereCondition = {};
    if (role === "Super Admin" || role === "Admin") {
      whereCondition = {};
    } else {
      whereCondition = { receiver_id: userId };
    }

    //Fetch messages
    const messages = await Messages.findAll({
      where: whereCondition,
      include: [
        { model: User, as: "sender", attributes: ["username", "email"] }, //sender info
        { model: User, as: "receiver", attributes: ["username", "email"] },
      ],
      order: [["createdAt", "DESC"]], // Order by newest
    });

    res.status(200).json({
      message: "Messages retrieved successfully",
      data: messages,
    });
  } catch (error) {
    console.error("Error in receiveMessages: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { sendMessages, receiveMessages };
