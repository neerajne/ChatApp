const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
  console.log("Headers received:", req.headers);
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log("Token:", token); // Log the token

      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      console.log("Decoded:", decoded); // Log the decoded token

      // Check if the decoded token contains the expec ted user ID
      if (!decoded || !decoded.iD) {
        console.log("Invalid token:", decoded);
        res.status(401);
        throw new Error("Not authorized, invalid token");
      }

      console.log("till now everything is correct ");

      // Attempt to find the user in the database
      const user = await User.findOne({ _id: decoded.iD }).select("-password"); //-PASSWORD MEANS THAT DO NOT SEND PASSSWORD OTHER THAN PASSWORD SEND EVERYTHING
      console.log("User found:", user); // Log the found user

      // Attach the user to the request object if found
      if (user) {
        req.user = user;
        next();
      } else {
        console.log("User not found for ID:", decoded.iD);
        res.status(401);
        throw new Error("Not authorized, user not found");
      }
    } catch (error) {
      console.error("Error during token verification or user lookup:", error); // Log the error
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    console.log("No authorization header or Bearer token missing");
    res.status(401).json({ message: "Not authorized, no token found" });
  }
});

module.exports = protect;
