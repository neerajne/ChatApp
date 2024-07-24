const expressAsyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

const sendMessage = expressAsyncHandler(async (req, res) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    res.status(400).json({
      message: "content or chatId cannot be empty !!",
    });
  }
  var newMesage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };
  try {
    var message = await Message.create(newMesage);
    message = await message.populate("sender", "-password");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name email pic ",
    });
    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });
    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
const allMessages = expressAsyncHandler(async (req, res) => {
  const { chatId } = req.params;
  if (!chatId) {
    res.status(400).json({
      message: "content or chatId cannot be empty !!",
    });
  }
  try {
    var chat = await Message.find({ chat:chatId })
    .populate("sender","name email pic")
    .populate("chat");
    res.status(200).send(chat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { sendMessage, allMessages };
