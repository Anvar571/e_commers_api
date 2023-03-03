const blog = require("../models/blogModel");
const User = require("../models/UserModel");

const asyncHandler = require("express-async-handler");
const cloudinaryUploading = require("../utils/cloudImage");
const blogModel = require("../models/blogModel");

const createBlog = asyncHandler(async (req, res) => {
  try {
    const newBlog = await blog.create(req.body);
    res.json({
      message: "success created blog",
      newBlog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const updateBlog = await blog.findByIdAndUpdate(id, req.body);
    res.json({
      message: "success created blog",
      updateBlog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    await blog.findByIdAndUpdate(
      id,
      {
        $inc: { numViews: 1 },
      },
      { new: true }
    );

    const getOneBlog = await blog
      .findById(id)
      .populate("likes", "name email mobile")
      .populate("disLikes", "name email mobile")

      res.json({
      getOneBlog,
      // getBlog
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getALlBlog = asyncHandler(async (req, res) => {
  try {
    const getAllBlogs = await blog.find({});
    res.json({
      getAllBlogs,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    await blog.findByIdAndDelete(id);
    res.json({
      message: "delete successfully",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const likeBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  const findBlog = await blog.findById(blogId);

  const loginUserId = req?.user?.id;

  const isLiked = findBlog?.isDisLiked;

  const alreadyLiked = findBlog?.likes.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );

  if (alreadyLiked) {
    const blogOne = await blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    return res.json(blogOne);
  }
  if (isLiked) {
    const blogOne = await blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { disLikes: loginUserId },
        isDisLiked: false,
      },
      { new: true }
    );
    return res.json(blogOne);
  } else {
    const blogOne = await blog.findByIdAndUpdate(
      blogId,
      {
        $push: { likes: loginUserId },
        isLiked: true,
      },
      { new: true }
    );
    res.json(blogOne);
  }
});

const dislikeBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  const findBlog = await blog.findById(blogId);

  const loginUserId = req?.user?.id;

  const isLiked = findBlog?.isLiked;

  const alreadyLiked = findBlog?.disLikes.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );

  if (alreadyLiked) {
    const blogOne = await blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { disLikes: loginUserId },
        isDisLiked: false,
      },
      { new: true }
    );
    return res.json(blogOne);
  }
  if (isLiked) {
    const blogOne = await blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    return res.json(blogOne);
  } else {
    const blogOne = await blog.findByIdAndUpdate(
      blogId,
      {
        $push: { disLikes: loginUserId },
        isDisLiked: true,
      },
      { new: true }
    );
    res.json(blogOne);
  }
});

const blogImageUpload = asyncHandler(async (req, res) => {
  const {id} = req.params;

  try {
    const uploader = (path) => cloudinaryUploading(path, "images");
    const urls = [];
    for (const file of req.files){
      const {path} = file;
      const newPath = await uploader(path);
      urls.push(newPath);
    }

    const findBlog = await blogModel.findByIdAndUpdate(
      id,
      {
        images: urls.map((file) => {
          return file
        })
      },{new: true}
    )
    
    res.json({findBlog});
  } catch (error) {
    throw new Error(error)
  }
})

module.exports = {
  createBlog,
  updateBlog,
  getBlog,
  getALlBlog,
  deleteBlog,
  likeBlog,
  dislikeBlog,
  blogImageUpload
};
