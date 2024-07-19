const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://neeraj:neeraj963258@cluster0.fb7620u.mongodb.net/chatApplication"
    );
    console.log("DB connection successful");
  } catch (error) {
    console.error("DB connection failed:", error);
  }
};

module.exports = connectDB;
