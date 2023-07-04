const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { config } = require("../config/secret")

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    phone:String,
    birth_date:Date,
    // img: String,
    active: { type: Boolean, default:true},
    date_created: {
        type: Date, default: Date.now()
    },
    role: {
        type: String, default: "user"
    },
    orders: [mongoose.ObjectId],
    likes:[ mongoose.ObjectId],
    cart: [{product:mongoose.ObjectId,amount:Number,color:String,size:String}]
});

exports.UserModel = mongoose.model("users", userSchema);

exports.validUser = (_reqBody) => {
    let joiSchema = Joi.object({
        name: Joi.string().min(2).max(50).required(),
        email: Joi.string().min(2).max(100).email().required(),
        password: Joi.string().min(6).max(50).required(),
        img: Joi.string().min(2).max(99).allow(null, ""),
        phone: Joi.string().min(8).max(99).required(),
        birth_date: Joi.string().min(2).max(99).required()
    });
    return joiSchema.validate(_reqBody);
}

exports.createToken = (_userId, role) => {
    let token = jwt.sign({ _id: _userId, role }, config.tokenSecret, { expiresIn: "60min" });
    return token;
}

exports.validLogin = (_reqBody) => {
    let joiSchema = Joi.object({
        email: Joi.string().min(2).max(100).email().required(),
        password: Joi.string().min(6).max(50).required()
    });
    return joiSchema.validate(_reqBody);
}

