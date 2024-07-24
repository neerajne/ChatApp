const expressAsyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const accessChat = expressAsyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    console.log("userId param not found in req.body");
    return res.sendStatus(400);
  }
  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  //WHY DOING LIKE THIS ? Using User.populate after the query:
  // When you want to populate a nested field after you've retrieved the documents and when the nested field references another model (User in this case), you use the model that the field references.
  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).send(fullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

const fetchChats = expressAsyncHandler(async (req, res) => {
  try {
    var result = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("latestMessage")
      .populate("groupAdmin", "-password")
      .sort({ updatedAt: -1 });
    result = await User.populate(result, {
      path: "latestMessage.sender",
      select: "name pic email",
    });
    res.status(200).send(result);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

const createGroupChat = expressAsyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send("plz fill all the fields");
  }
  var users = req.body.users;
  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group");
  }
  users.push(req.user);
  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      isGroupChat: true,
      users: users,
      groupAdmin: req.user,
    });
    //AFTER CREATING THE GROUP CHAT FINDING THAT USER
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).send(fullGroupChat);
  } catch (error) {
    res.json(400).send(error.message);
  }
});

const renameGroupChat = expressAsyncHandler(async (req, res) => {
  const { chatId, newName } = req.body;
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { chatName: newName },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(200);
    throw new Error("chat not updated");
  } else {
    res.status(200).send(updatedChat);
  }
});

const addToGroup = expressAsyncHandler(async (req, res) => {
  const { chatId, newUser } = req.body;
  const addedUserToChat = await Chat.findByIdAndUpdate(
    chatId,
    { $push: { users: newUser } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

    const results = await Chat.findById({_id:chatId})
  if (addedUserToChat) {
    res.status(200).send(results);
  } else {
    res.status(400);
    throw new Error("unable to add to the chat");
  }
});

const removeFromGroup = expressAsyncHandler(async (req, res) => {
  const { chatId, removeUser } = req.body;
  const removeUserFromChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: removeUser },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  const chat = await Chat.findById( chatId )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (removeUserFromChat) {
    res.status(200).send(chat);
  } else {
    res.status(400);
    throw new Error("unable to remove user from the chat");
  }
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroupChat,
  addToGroup,
  removeFromGroup,
};
