const express = require("express");
const sequelize = require("./db");
const User = require("./models/userModel");
const Message = require("./models/messageModel");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();
app.use(express.json());

console.log("App is starting...");

const cookieParser = require("cookie-parser");
app.use(cookieParser());

//Mount the routes
app.use("/api/auth", authRoutes);
app.use("/api", adminRoutes);
app.use("/api/messages", messageRoutes);

//Sync the model with the database
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database connected and tables are synced");
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });

module.exports = app;
