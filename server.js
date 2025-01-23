const express = require("express");
const app = require("./src/app");
const http = require("http");
const PORT = 3000;
const socketIo = require("socket.io");

//start the server
const server = http.createServer(app);

//Initialize socket.io
const io = socketIo(server);

//Pass io instance
app.set("io", io);

//Handle Websocket connection
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("sendMessage", (message) => {
    console.log("Received message:", message);

    //Brodcast the message
    io.emit("newMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
