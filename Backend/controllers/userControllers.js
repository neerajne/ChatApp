const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../data/generateToken");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!name || !email || !password) {
    throw new Error("name , email or password is missing");
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("user already exists !");
  }

  const newUser = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (newUser) {
    res.status(200).json({
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      pic: newUser.pic,
      token: generateToken(newUser._id),
    });
  } else {
    res.status(400);
    throw new Error("failed to create User");
  }
    // console.log(newUser);
});

const authUser = asyncHandler(async (req, res) => {
  console.log("Received login request. Body:", req.body);
  const { email, password } = req.body;
  // console.log("Extracted email:", email, "password:", password);
  // console.log(email, password);
  const existingUser = await User.findOne({ email });
  // console.log("existing user is " , existingUser)
  console.log(existingUser);
  if (!existingUser) {
    console.log(`User with email '${email}' not found.`);
    res.status(401);
    throw new Error("Invalid email or password");
  }
  if (
    existingUser &&
    (await existingUser.matchPassword(password, existingUser.password))
  ) {
    // console.log(existingUser);

    //becaus ethe match password is available for all the documents in the collection so here this user whom we are finding ios also a document
    res.status(200).json({
      id: existingUser._id,
      name: existingUser.name,
      email: existingUser.email,
      pic: existingUser.pic,
      token: generateToken(existingUser._id),
    });
  } else {
    res.status(400);
    throw new Error("User doesnt exsits !!");
  }
});

//FOR SEARCHING THE USERS
const allUsers = asyncHandler(async (req, res) => {
  const searchQuery = req.query.search || "";

  const search = searchQuery
    ? {
        $or: [
          { name: { $regex: searchQuery, $options: "i" } },
          { email: { $regex: searchQuery, $options: "i" } },
        ],
      }
    : {};

  console.log("Search query:", searchQuery); // Log the search query
  console.log("Search criteria:", JSON.stringify(search, null, 2)); // Log the search criteria

  try {
    // Add pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find(search)
      .find({ _id: { $ne: req.user._id } })
      .skip(skip)
      .limit(limit);

    console.log("Users found:", users); // Log the users found
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error); // Log any errors
    res.status(500).json({ message: error.message });
  }
});

module.exports = { registerUser, authUser, allUsers };
