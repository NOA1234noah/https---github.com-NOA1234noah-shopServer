// 3
const orderR = require("./order");
const usersR = require("./user");
const cartR = require("./cart");
const productR = require("./product");

exports.routesInit = (app) => {
  app.use("/users",usersR);
  app.use("/order",orderR);
  app.use("/cart",cartR);
  app.use("/products",productR);
 
}