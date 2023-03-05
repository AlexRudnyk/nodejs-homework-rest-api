const { User } = require("../../models/user");
const { NotFound } = require("http-errors");

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw new NotFound("User not found");
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });
  res.send(`<!DOCTYPE html>
  <html>
  <head>
      <title>Главная</title>
      <meta charset="utf-8" />
  </head>
  <body>
      <h1>Verification successful</h1>
      <a href="http://localhost:3000/Phonebook-frontend-new/login">Go to Login page</a>
  </body>
  <html>`);
};

module.exports = verifyEmail;
