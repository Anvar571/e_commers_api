const { createBlog, updateBlog, getBlog, getALlBlog, deleteBlog, likeBlog, dislikeBlog } = require("../controller/blogCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const router = require("express").Router();

router.post("/create", authMiddleware,isAdmin, createBlog);

router.get("/blogs", getALlBlog);
router.get("/:id", getBlog);

router.put("/like", authMiddleware, likeBlog);
router.put("/dislike", authMiddleware, dislikeBlog)

router.put("/update/:id", authMiddleware, isAdmin, updateBlog);
router.delete("/:id", deleteBlog);

module.exports = router