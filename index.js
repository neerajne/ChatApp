const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const chats = require("./Backend/data/data.js");
const connectDB = require("./Backend/models/mongooseConnection.js");
const app = express();
const userRoutes = require("./Backend/routes/userRoutes.js");
const chatRoutes = require("./Backend/routes/chatRoutes.js");
const messageRoutes = require("./Backend/routes/messageRoutes.js");

const {
  notFound,
  errorHandler,
} = require("./Backend/middlewares/errorMiddleware.js");
app.use(cors({ origin: "http://localhost:3000" }));

app.use(express.json()); //TO ACCEPT JSON DATA FROM THE FRONTEND

//CALLING THIS FUNCTION FOR THE CONNECTION WITH DB
connectDB();

//HOME ROUTE
app.get("/", (req, res) => {
  res.send("home page");
});

//USER ROUTE
app.use("/api/users", userRoutes);

// CHATS ROUTE
app.use('/api/chats',chatRoutes) ;

// MESSAGES ROUTE
app.use('/api/messages',messageRoutes) ;


//INDIVISUAL CHAT
app.get("/api/chats/:id", (req, res) => {
  const id = req.params.id;
  const singleChat = chats.find((chat) => chat._id === id);
  res.send(singleChat);
});

app.use(notFound);
app.use(errorHandler);

app.listen(process.env.PORT || 8080, () => {
  console.log("server is listening to port 8080");
});
