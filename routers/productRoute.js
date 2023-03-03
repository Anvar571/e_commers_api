const express = require("express");
const {
  ProductCreate,
  getAllProduct,
  getOneProduct,
  updateProduct,
  deleteProduct,
  addWishList,
  ratingProduct,
  uploadProdImage,
} = require("../controller/productCtrl");

const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const {
  uploadPhoto,
  productImageResize,
} = require("../middlewares/uploadimage");

const router = express.Router();

router.post("/create", authMiddleware, isAdmin, ProductCreate);

router.put(
  "/upload/:id",
  authMiddleware,
  uploadPhoto.array("images", 10),
  productImageResize,
  uploadProdImage
);

router.get("/all", getAllProduct);
router.get("/:id", getOneProduct);
router.put("/wishlist", authMiddleware, addWishList);
router.put("/rating", authMiddleware, ratingProduct);

router.put("/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);

module.exports = router;
