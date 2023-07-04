const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
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
        },
      },
    ],
  },
  { timestamps: true }
);
exports.CartModel = mongoose.model("Carts", CartSchema);
