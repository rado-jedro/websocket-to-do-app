const express = require("express");
const app = express();
const socket = require('socket.io'); 

const tasks = [];

const server = app.listen(process.env.PORT || 8000, () => {
  console.log("Server is running...");
});

app.use((req, res) => {
  res.status(404).send({ message: "Not found..." });
});

const io = socket(server);

io.on("connection", socket => {
  console.log(socket.io, "connected");

  socket.on("disconnect", socket => {
    console.log(socket.io, "disconnected");
  });
});
