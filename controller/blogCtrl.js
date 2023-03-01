const blog =require("../models/blogModel");
const User = require("../models/UserModel");

const asyncHandler = require("express-async-handler");

const createBlog = asyncHandler(async (req, res) => {
    try {
        const newBlog = await blog.create(req.body)
        res.json({
            message: "success created blog",
            newBlog
        })
    } catch (error) {
        throw new Error(error);
    }
})

module.exports = {
    createBlog
}