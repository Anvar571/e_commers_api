const routers = require("express").Router();

routers.use("/auth", require("./authRoute"));
routers.use("/product", require("./productRoute"));
routers.use("/blog", require("./blogRoute"));

module.exports = routers  