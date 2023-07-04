const mongoose = require("mongoose");
const Joi = require("joi");

const ProductSchema = new mongoose.Schema(
  {
    title: String,
    desc: String,
    img: String,
    categories: Array,
    size: Array,
    color: Array,
    price: Number,
    inStock: { type: Boolean, default: true },
  }
);

exports.ProductModel = mongoose.model("Products", ProductSchema);

exports.productValid = (_reqBody) => {
    let joiSchema = Joi.object({
        title: Joi.string().min(2).max(50).required(),
        desc: Joi.string().min(1).max(50).required(),
        img: Joi.string().min(1).max(30000).required(),
        price: Joi.number().required(),
        categories:Joi.array(),
        size:Joi.array(),
        color:Joi.array()
    });
    return joiSchema.validate(_reqBody);
}
exports.productCartValid = (_reqBody) => {
  let joiSchema = Joi.object({
      title: Joi.string().min(2).max(50).required(),
      desc: Joi.string().min(1).max(50).required(),
      img: Joi.string().min(1).max(30000).required(),
      price: Joi.number().required(),
      categories:Joi.string(),
      size:Joi.string(),
      color:Joi.string()
  });
  return joiSchema.validate(_reqBody);
}