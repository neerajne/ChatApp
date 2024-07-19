const jwt = require("jsonwebtoken");

//FOR GENERATING THE JSON WEB TOKEN
const generateToken = (id) => {
  const payload = {
    iD: id,
  };
  const secretKey = process.env.SECRET_KEY;
  const options = {
    expiresIn: "365d",
  };
  const token = jwt.sign(payload, secretKey, options);
  console.log(`ur token is ${token}`);
  return token ;
};

module.exports = generateToken;
