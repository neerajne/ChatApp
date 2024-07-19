const mongoose = require("mongoose");
const { Schema } = mongoose;
const Message = require("./messageModel.js");
const chatSchema = new Schema(
  {
    chatName: {
      type: String,
      trim: true,
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    latestMessage: [
      {
        type: Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
    groupAdmin: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;

// mongodb+srv://neeraj:neeraj963258@cluster0.fb7620u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
