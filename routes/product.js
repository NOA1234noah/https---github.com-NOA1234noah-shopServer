// 12
const express = require("express");
const { auth, authAdmin } = require("../middlewares/auth");
const { ProductModel, productValid } = require("../models/productModel");
const router = express.Router();

router.get("/", async (req, res) => {
  let perPage = req.query.perPage || 30;
  let page = req.query.page || 1;
  let sort = req.query.sort || "_id";
  let reverse = req.query.reverse == "yes" ? 1 : -1;
let cat=req.query.category||"";
console.log(cat);

// categories: { $in: cat } 
  try {
    let data = await ProductModel.find({})
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ [sort]: reverse })
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg: "there error try again later", err })
  }
})

router.get("/count", async (req, res) => {
  try {
    let count = await ProductModel.countDocuments({})
    res.json({ count });
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg: "there error try again later", err })
  }
})

router.post("/", authAdmin, async (req, res) => {
  let validBody = productValid(req.body);
  if (validBody.error) {
    res.status(400).json(validBody.error.details)
  }
  try {
      let product = new ProductModel(req.body);
      await product.save();
      res.json(product);
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }
})
router.get("/:id", async (req, res) => {
  try {
    const product = await ProductModel.findById(
      req.params.id
    );
    res.json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.put("/:idEdit", authAdmin, async (req, res) => {
  let validBody = productValid(req.body);
  if (validBody.error) {
    res.status(400).json(validBody.error.details)
  }
  try {
    let idEdit = req.params.idEdit
    let data;
     data = await ProductModel.updateOne({ _id: idEdit }, req.body);
      res.json(data);
    
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }
})

router.delete("/:idDel", authAdmin, async (req, res) => {
  try {
    let idDel = req.params.idDel
    let  data = await ProductModel.deleteOne({ _id: idDel });
      res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }
})


module.exports = router;