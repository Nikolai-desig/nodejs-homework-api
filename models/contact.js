const { Schema, model } = require("mongoose");

const Joi = require("joi")

const handleMongooseError = require("../helpers/handleMongooseError");

const contactSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  owner: {
   type: Schema.Types.ObjectId,
   ref: "user",
   required: true, 
  }
});

contactSchema.post("save", handleMongooseError)

const addSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),
});

const updateFavoriteShema = Joi.object({
    favorite: Joi.boolean().required(),
})

const shemas = {
    addSchema,
    updateFavoriteShema
}

const Contact = model("contact", contactSchema);

module.exports = {
    Contact,
    shemas,
};
