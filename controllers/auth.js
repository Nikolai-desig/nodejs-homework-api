const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const { SECRET_KEY } = process.env;

const { User } = require("../models/user");

const { HttpError, ctrlWraper } = require("../helpers");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email already in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ ...req.body, password: hashPassword });

  res.status(201).json({
    email: newUser.email,
    name: newUser.name,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password invalid");
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

module.exports = {
  register: ctrlWraper(register),
  login: ctrlWraper(login),
  getCurrent: ctrlWraper(getCurrent),
  logout: ctrlWraper(logout),
  updateSubscriptionUser: ctrlWraper(updateSubscriptionUser),
};
