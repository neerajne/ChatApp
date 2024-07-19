const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 18,
  },
  pic: {
    type: String,
    required: true,
    default:
      "https://images.wallpapersden.com/image/download/satoru-gojo-jujutsu-kaisen_bGhlZm2UmZqaraWkpJRmZ2VlrWZuZ2U.jpg",
  },
},{
 timestamps:true 
});

//THIS IS CALLED INSTANCE METHOD THIS METHOD IS AVAILABLE FOR ALL THE DOCUMENTS OF A CERTAIN COLLECTION
userSchema.methods.matchPassword = async function (
  enterdPassword,
  existingUserPassword
) {
  return await bcrypt.compare(
    enterdPassword,
    existingUserPassword,
  );
};

userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  bcrypt.genSalt(12, function (err, salt) {
    if (err) {
      console.log(err);
    }
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) {
        console.log(err);
      }
      user.password = hash;
      console.log(hash);
      next();
    });
  });
});
const User = mongoose.model("User", userSchema);

module.exports = User;
