const routers = require("express").Router();

routers.use("/auth", require("./authRoute"));
routers.use("/product", require("./productRoute"));

module.exports = routers  