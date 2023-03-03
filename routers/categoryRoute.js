const { createCategory, updateCategory, deleteCategory, getallCategory, getOneCategory } = require("../controller/categoryCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const router = require("express").Router();

router.post("/create", authMiddleware, isAdmin, createCategory);
router.put("/:id", authMiddleware, isAdmin, updateCategory);
router.delete("/:id", authMiddleware, isAdmin, deleteCategory);
router.get("/allcategory", getallCategory);
router.get("/:id", getOneCategory);

module.exports = router