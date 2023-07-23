const { Contact } = require("../models/contact");

const { HttpError, ctrlWraper } = require("../helpers");

const { shemas } = require("../models/contact");

const getAll = async (req, res) => {
  const result = await Contact.find();
  res.json(result);
};

const getById = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findById(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const addCnt = async (req, res) => {
  const { error } = shemas.addSchema.validate(req.body);
  if (error) {
    throw HttpError(400, "Missing required name field");
  }
  const result = await Contact.create(req.body);
  res.status(201).json(result);
};

const updateById = async (req, res) => {
  const { error } = shemas.addSchema.validate(req.body);
  if (error) {
    throw HttpError(400, "Missing fields");
  }
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const updateFavorite = async (req, res) => {
  const { error } = shemas.updateFavoriteShema.validate(req.body);
  if (error) {
    throw HttpError(400, "Missing fields favorite");
  }
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const deleteById = async (req, res) => {
      const { id } = req.params;
      const result = await Contact.findByIdAndDelete(id);
      if (!result) {
        throw HttpError(404, "Not found");
      }
      res.json({ message: "Contact deleted" });
  }

module.exports = {
  getAll: ctrlWraper(getAll),
  getById: ctrlWraper(getById),
  addCnt: ctrlWraper(addCnt),
  updateById: ctrlWraper(updateById),
  updateFavorite: ctrlWraper(updateFavorite),
  deleteById: ctrlWraper(deleteById),
};
