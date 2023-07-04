
const express = require("express");
const bcrypt = require("bcrypt");
const { auth, authAdmin } = require("../middlewares/auth");
const { CartModel } = require("../models/cartModel");
const router = express.Router();

//CREATE
router.post("/", auth, async (req, res) => {
  const newCart = new Cart(req.body);
  try {
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE
router.put("/:id", auth, async (req, res) => {
  if (req.user.id === req.params.id || req.tokenData.role == "admin") {
    try {
      const updatedCart = await Cart.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedCart);
    }
    catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You are not alowed to do that!");
  }
});

//DELETE
router.delete("/:id", auth, async (req, res) => {
  if (req.user.id === req.params.id || req.tokenData.role == "admin") {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json("Cart has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }}
  else {
    res.status(403).json("You are not alowed to do that!");
  }
});

//GET USER CART
router.get("/find/:userId", auth, async (req, res) => {
  if (req.user.id === req.params.id || req.tokenData.role == "admin") {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }}
  else {
    res.status(403).json("You are not alowed to do that!");
  }
});

// //GET ALL

router.get("/", authAdmin, async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
