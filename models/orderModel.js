const mongoose = require("mongoose");
const Joi = require("joi");


const OrderSchema = new mongoose.Schema(
  {
    userId: String,
    products: [
      {
        productId: {
          type: String,
        },

        quantity: {
          type: Number,
          default: 1,
        }
      },
    ],
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

exports.OrderModel = mongoose.model("Order", OrderSchema);

exports.orderValid = (_reqBody) => {
  let joiSchema = Joi.object({
    amount: Joi.number().required(),
    address: Joi.object.require()
  });
  return joiSchema.validate(_reqBody);
}