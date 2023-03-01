const { createBlog } = require("../controller/blogCtrl");

const router = require("express").Router();

router.post("/create", createBlog);

module.exports = router