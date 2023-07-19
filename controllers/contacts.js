const Joi = require("joi");

const contacts = require("../models/contacts");

const { HttpError, ctrlWraper } = require("../helpers");

const addSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});

const getAll = async (req, res) => {
    const result = await contacts.listContacts();
    res.json(result);
};

const getById = async (req, res) => {
    const { id } = req.params;
    const result = await contacts.getContactById(id);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json(result);
};

const addCnt = async (req, res) => {
    const { error } = addSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const result = await contacts.addContact(req.body);
    res.status(201).json(result);
};

const updateById = async (req, res) => {
    const { error } = addSchema.validate(req.body);
    if (error) {
      throw HttpError(400, "Missing fields");
    }
    const { id } = req.params;
    const result = await contacts.updateContact(id, req.body);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json(result);
};

const deleteById = async (req, res) => {
      const { id } = req.params;
      const result = await contacts.deleteById(id);
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
  deleteById: ctrlWraper(deleteById),
};
