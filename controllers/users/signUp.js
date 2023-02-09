const { User } = require("../../models/user");
const { Conflict } = require("http-errors");
const gravatar = require("gravatar");

const signUp = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw new Conflict(`${email} in use`);
  }
  const avatarURL = gravatar.url(email);
  const newUser = new User({ email, avatarURL });
  newUser.setPassword(password);
  newUser.save();
  res.status(201).json({
    user: {
      email,
      subscription: "starter",
      avatarURL,
    },
  });
};

module.exports = signUp;
