const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const chats = require("./Backend/data/data.js");
const connectDB = require("./Backend/models/mongooseConnection.js");
const app = express();
const userRoutes = require("./Backend/routes/userRoutes.js");
const chatRoutes = require("./Backend/routes/chatRoutes.js");
const path = require("path");
const messageRoutes = require("./Backend/routes/messageRoutes.js");
const {
  notFound,
  errorHandler,
} = require("./Backend/middlewares/errorMiddleware.js");

// CORS Configuration
app.use(
  cors({
    origin: [
      "https://connectflock.netlify.app",
      "https://main--connectflock.netlify.app",
    ], // Allow multiple origins
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Enable credentials (cookies, authorization headers)
  })
);

app.use(express.json());
connectDB();

app.get("/", (req, res) => res.send("home page"));
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);

app.use(notFound);
app.use(errorHandler);

const server = app.listen(process.env.PORT || 8080, () => {
  console.log("server is listening to port 8080");
});

// Updated Socket.IO CORS Configuration
const io = require("socket.io")(server, {
  cors: {
    origin: [
      "https://connectflock.netlify.app",
      "https://main--connectflock.netlify.app",
    ], // Allow multiple origins
    methods: ["GET", "POST"],
    credentials: true, // Enable credentials (cookies, authorization headers)
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData.id);
    console.log("user id", userData.id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("user joined room" + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;
    console.log("chat", chat);
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;
      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData.id);
  });
});
