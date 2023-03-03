const {
  createBlog,
  updateBlog,
  getBlog,
  getALlBlog,
  deleteBlog,
  likeBlog,
  dislikeBlog,
  blogImageUpload,
} = require("../controller/blogCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { blogImageResize, uploadPhoto } = require("../middlewares/uploadimage");

const router = require("express").Router();

router.post("/create", authMiddleware, isAdmin, createBlog);

router.put(
  "/upload/:id",
  authMiddleware,
  uploadPhoto.array("images", 10),
  blogImageResize,
  blogImageUpload
);

router.get("/blogs", getALlBlog);
router.get("/:id", getBlog);

router.put("/like", authMiddleware, likeBlog);
router.put("/dislike", authMiddleware, dislikeBlog);

router.put("/update/:id", authMiddleware, isAdmin, updateBlog);
router.delete("/:id", deleteBlog);

module.exports = router;
