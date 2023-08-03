const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const {nanoid} = require("nanoid")

const { SECRET_KEY, BASE_URL } = process.env;

const { User } = require("../models/user");

const { HttpError, ctrlWraper, sendEmail } = require("../helpers");

const avatarsDir = path.join(__dirname, "../", "public", "avatars")

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email already in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationToken = nanoid();

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken
  });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationToken}">Click verify email</a>`
  }

  await sendEmail(verifyEmail);

  res.status(201).json({
    email: newUser.email,
    name: newUser.name,
  });
};

const verifyEmail = async (req, res) => {
  const {verificationToken} = req.params;
  const user = await User.findOne({verificationToken});
  if(!user){
    throw HttpError(401, "Email not found")
  }
  await User.findByIdAndUpdate(user._id, {verify: true, verificationToken: ""});

  res.json({
    message: "Email verify success"
  })
}

const resendVerifyEmail = async (req, res) => {
  const {email} = req.body;
  const user = await User.findOne({email});
  if(!user){
    throw HttpError(401, "Missing required field email");
  };
  if(user.verify){
    throw HttpError(402, "Verification has already been passed")
  }

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${user.verificationToken}">Click verify email</a>`
  };

  await sendEmail(verifyEmail);

  res.json({
    message: "Verify email sent"
  })
}

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password invalid");
  }

  if(!user.verify){
    throw HttpError(401, "Email not verified")
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password invalid");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
  });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;

  res.json({
    email,
    subscription,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.json({
    message: "Logout success",
  });
};

const updateSubscriptionUser = async (req, res, next) => {
  const { error } = schemas.updateSubscriptionSchema.validate(req.body);
  if (error) {
    throw HttpError(400);
  }

  const { subscription } = req.body;
  if (!["starter", "pro", "business"].includes(subscription)) {
    throw HttpError(400);
  }
  const { id } = req.params;
  const result = await User.findByIdAndUpdate(
    id,
    { subscription },
    { new: true }
  );
  if (!result) {
    throw HttpError(404);
  }

  res.json(result);
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tmpUpload, originalname } = req.file;
  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);

  const avatar = await Jimp.read(tmpUpload);
  if (!avatar) {
    throw HttpError(500);
  }
  avatar.resize(250, 250);
  await avatar.writeAsync(resultUpload);

  await fs.unlink(tmpUpload);
  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({
    avatarURL,
  });
};

module.exports = {
  register: ctrlWraper(register),
  verifyEmail: ctrlWraper(verifyEmail),
  resendVerifyEmail: ctrlWraper(resendVerifyEmail),
  login: ctrlWraper(login),
  getCurrent: ctrlWraper(getCurrent),
  logout: ctrlWraper(logout),
  updateSubscriptionUser: ctrlWraper(updateSubscriptionUser),
  updateAvatar: ctrlWraper(updateAvatar),
};
