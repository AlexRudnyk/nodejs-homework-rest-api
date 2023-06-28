const { User } = require("../../models/user");
const { Conflict } = require("http-errors");
const gravatar = require("gravatar");
const { v4 } = require("uuid");
const { sendEmail } = require("../../helpers");

const signUp = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw new Conflict(`${email} in use`);
  }
  const avatarURL = gravatar.url(email);
  const verificationToken = v4();
  const newUser = new User({ email, avatarURL, verificationToken });
  newUser.setPassword(password);
  await newUser.save();

  // Email confirmation

  const mail = {
    to: email,
    subject: "Email confirmation",
    // html: `<a target="_blank" href="http://localhost:4000/api/users/verify/${verificationToken}">Please confirm your email</a>`,
    html: `<a target="_blank" href="https://nodejs-homework-rest-api-sandy.vercel.app/api/users/verify/${verificationToken}">Please confirm your email</a>`,
  };

  await sendEmail(mail);

  res.status(201).json({
    email,
    subscription: "starter",
    avatarURL,
    verificationToken,
  });
};

module.exports = signUp;
