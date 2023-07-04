
const express = require("express");
const bcrypt = require("bcrypt");
const { auth, authAdmin } = require("../middlewares/auth");
const { UserModel, createToken, validLogin, validUser } = require("../models/UserModel");
const router = express.Router();

router.get("/", async (req, res) => {
  res.json({ msg: "Users work" })
})

router.get("/checkToken", auth, async (req, res) => {
  res.json(req.tokenData);
})
router.get("/myInfo", auth, async (req, res) => {
  try {
    let userInfo = await UserModel.findOne({ _id: req.tokenData._id }, { password: 0 });
    res.json(userInfo);
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }
})


router.get("/usersList", async (req, res) => {
  try {
    let data = await UserModel.find({}, { password: 0 }).limit(20).populate({ path: "cart.product", model: "Products" });
    res.json(data)
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }
})
router.get("/:id", async (req, res) => {
  try {
    let data = await UserModel.findOne({ _id: req.params.id }, { password: 0 }).populate({ path: "cart.product", model: "Products" }).populate({path:"likes",model:"Products"});
    res.json(data)
    console.log(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }
})
router.put("/:id", async (req, res) => {
  try {
    req.body.password = await bcrypt.hash( req.body.password, 10);
    req.body.birth_date = Date.parse( req.body.birth_date);
    let data = await UserModel.findOneAndUpdate({ _id: req.params.id },req.body);
    req.body.password = "*****";
    res.status(201).json(user);v
    console.log(data);
    
    }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }
})
router.get("/count", authAdmin, async (req, res) => {
  try {
    let count = await UserModel.countDocuments({})
    res.json({ count })
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }
})

router.post("/", async (req, res) => {
  let validBody = validUser(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let user = new UserModel(req.body);
    user.password = await bcrypt.hash(user.password, 10);
    user.birth_date = Date.parse(user.birth_date);
    await user.save();
    user.password = "*****";
    
    let token = createToken(user._id, user.role);
    res.json({ token, user });
  }
  catch (err) {
    if (err.code == 11000) {
      return res.status(500).json({ msg: "Email already in system, try log in", code: 11000 })

    }
    console.log(err);
    res.status(500).json({ msg: "err", err })
  }
})

router.post("/login", async (req, res) => {
  let validBody = validLogin(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let user = await UserModel.findOne({ email: req.body.email }).populate({ path: "cart.product", model: "Products" }).populate({path:"likes",model:"Products"});
    if (!user) {
      return res.status(401).json({ msg: "Password or email is worng ,code:1" })
    }
    let authPassword = await bcrypt.compare(req.body.password, user.password);
    if (!authPassword) {
      return res.status(401).json({ msg: "Password or email is worng ,code:2" });
    }
    if(user.active==false){
      return res.status(401).json({ msg: "Unauthorized user" });
    }
    let token = createToken(user._id, user.role);
    console.log(user);
    res.json({ token, user });
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }
})
router.patch("/changeRole/:userID", authAdmin, async (req, res) => {
  if (!req.body.role) {
    return res.status(400).json({ msg: "Need to send role in body" });
  }

  try {
    let userID = req.params.userID
    // TODO:לשנות לאדמין הראשי
    if (userID == "649154ad5ce7a36137e5609c") {
      return res.status(401).json({ msg: "You cant change superadmin to user" });

    }
    let data = await UserModel.updateOne({ _id: userID }, { role: req.body.role })
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }
})

// router.patch("/active/:userID", authAdmin, async (req, res) => {
//   if (!req.body.active) {
//     return res.status(400).json({ msg: "Need to send active in body" });
//   }

//   try {
//     let userID = req.params.userID
//     // TODO:לשנות לאדמין הראשי
//     if (userID == "649154ad5ce7a36137e5609c") {
//       return res.status(401).json({ msg: "You cant change superadmin to not active" });

//     }
//     let data = await UserModel.updateOne({ _id: userID }, { active: req.body.active })
//     res.json(data);
//   }
//   catch (err) {
//     console.log(err)
//     res.status(500).json({ msg: "err", err })
//   }
// })

router.patch("/:id", async (req, res) => {
  let id = req.params.id;
  console.log(req.body.cart);
  try {
    let gg = await UserModel.findByIdAndUpdate(id, {
      $push: { 'cart': req.body.cart }
    });

    res.status(201).json(gg);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error", error: err });
  }
});

router.patch("/likes/add/:id", async (req, res) => {
  let id = req.params.id;
  console.log(req.body.likes);
  const likes = req.body.likes[0];
  try {
    let gg = await UserModel.findByIdAndUpdate(id, {
      $push:{'likes': likes }
    });

    res.status(201).json(gg);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error", error: err });
  }
});
router.patch("/likes/remove/:id", async (req, res) => {
  let id = req.params.id;
  console.log(req.body.likes);
  
  const likes = req.body.likes[0];
  try {

    let gg = await UserModel.findByIdAndUpdate(id, {
      $pop: { 'likes': likes }
    });

    res.status(201).json(gg);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error", error: err });
  }
});
router.patch("/resetCart/:id", async (req, res) => {
  let id = req.params.id;
  console.log(req.body.cart);
  try {
    let gg = await UserModel.findByIdAndUpdate(id, {'cart': req.body.cart }, { new: true });

    res.status(201).json(gg);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error", error: err });
  }
});


router.patch("/changeActive/:userID", authAdmin, async (req, res) => {
  if (!req.body.active && req.body.active != false) {
    return res.status(400).json({ msg: "Need to send active in body" });
  }

  try {
    let userID = req.params.userID
    //TODO:לא מאפשר ליוזר אדמין להפוך למשהו אחר/ כי הוא הסופר אדמין
    if (userID == "649154ad5ce7a36137e5609c") {
      return res.status(401).json({ msg: "You cant change superadmin to user" });

    }
    let data = await UserModel.updateOne({ _id: userID }, { active: req.body.active })
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }
})
router.delete("/:delId", authAdmin, async (req, res) => {
  let delId = req.params.delId;

  try {
    
    data = await UserModel.deleteOne({ _id: delId });
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg: "there error try again later", err })
  }
})

module.exports = router;