const routers = require("express").Router();

routers.use("/auth", require("./authRoute"));
routers.use("/product", require("./productRoute"));
routers.use("/blog", require("./blogRoute"));
routers.use("/category", require("./categoryRoute"));
routers.use("/blogcategory", require("./blogCategoryRoute"));
routers.use("/brand", require("./brandRoute"));

module.exports = routers  