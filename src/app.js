require("dotenv").config();
const http = require("http");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { Server } = require("socket.io");
const { handleError } = require("./middlewares/handleError");
const ApiError = require("./utils/apiError");
const { getKey } = require("./utils");
const app = express();

// apply middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// initiate database
require("./dbs/mongodb.init");

// initiate router
app.use("/v1/api", require("./routes"));

// handle error
app.use((req, res, next) => {
  next(
    new ApiError(404, [
      {
        msg: "Not Found",
      },
    ])
  );
});
app.use(handleError);

const server = http.createServer(app);

const io = new Server(server, {
  cors: "http://localhost:3000",
});
global.onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log(socket.id + " has connected");
  // global.chatSocket = socket;
  socket.on("addUser", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(onlineUsers);
    io.emit("getUsers", Array.from(onlineUsers));
    console.log(onlineUsers);
  });

  socket.on("sendMessage", ({ senderId, receiverId, message }) => {
    const receiverUserSocket = onlineUsers.get(receiverId);
    console.log({ senderId, receiverId, message });
    if (receiverUserSocket) {
      socket.to(receiverUserSocket).emit("getMessage", {
        senderId,
        message,
        createdAt: new Date(),
      });
    }
  });
  socket.on("disconnect", () => {
    console.log(socket.id + " has disconnected");
    onlineUsers.delete(getKey(onlineUsers, socket.id));
    io.emit("getUsers", Array.from(onlineUsers));
  });
});

module.exports = server;
