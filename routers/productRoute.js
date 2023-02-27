const express = require("express");
const { ProductCreate, getAllProduct, getOneProduct, updateProduct, deleteProduct } = require("../controller/productCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/create", authMiddleware, isAdmin, ProductCreate);
router.get("/products", getAllProduct);
router.get("/:id", getOneProduct);

router.put("/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);

module.exports = router