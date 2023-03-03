const asyncHandler = require("express-async-handler");
const { default: slugify } = require("slugify");
const productModel = require("../models/productModel");
const UserModel = require("../models/UserModel");
const cloudinaryUploading = require("../utils/cloudImage");
const ValidationMongodb = require("../utils/Validation");
const fs = require("fs");

const ProductCreate = asyncHandler(async (req, res) => {
  try {
    req.body.slug = slugify(req.body.title);
    const newProduct = await productModel.create(req.body);
    res.json({
      message: "add successfully",
      newProduct,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getAllProduct = asyncHandler(async (req, res) => {
  try {
    // filter
    const query = { ...req.query };
    const deleteQuery = ["limit", "sort", "fields", "page"];
    deleteQuery.forEach((el) => delete query[el]);

    let queryStr = JSON.stringify(query);
    queryStr = queryStr.replace(/\b(gte|lte|lt)\b/g, (match) => `$${match}`);

    let queryProduct = productModel.find(JSON.parse(queryStr));

    // sort
    if (req.query.sort) {
      let sortBy = req.query.sort.split(",").join(" ");
      queryProduct = queryProduct.sort(sortBy);
    } else {
      queryProduct = queryProduct.sort("-createdAt");
    }

    // limiting
    if (req.query.fields) {
      let fields = req.query.fields.split(",").join(" ");
      queryProduct = queryProduct.select(fields);
    } else {
      queryProduct = queryProduct.select("-__v");
    }

    // pagenation
    let page = req.query.page;
    let limit = req.query.limit;
    let skip = (page - 1) * limit;

    queryProduct = queryProduct.skip(skip).limit(limit);
    if (req.query.page) {
      const countDocument = await productModel.countDocuments();
      if (skip >= countDocument) throw new Error("This page is not exist");
    }

    const product = await queryProduct;
    res.json({ product });
  } catch (error) {
    throw new Error(error);
  }
});

const getOneProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const product = await productModel.findOne({ slug: id });
    res.json({ product });
  } catch (error) {
    throw new Error(error);
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updateProduct = await productModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json({ updateProduct });
  } catch (error) {
    throw new Error(error);
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    await productModel.findByIdAndDelete(id);
    res.json({ message: "delete success" });
  } catch (error) {
    throw new Error(error);
  }
});

const addWishList = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { producId } = req.body;
  try {
    const user = await UserModel.findById(_id);
    const alreadyadded = user.wishlist.find((id) => id.toString() === producId);
    if (alreadyadded) {
      const user = await UserModel.findByIdAndUpdate(
        _id,
        {
          $pull: { wishlist: producId },
        },
        { new: true }
      );
      res.json({ user });
    } else {
      const user = await UserModel.findByIdAndUpdate(
        _id,
        {
          $push: { wishlist: producId },
        },

        { new: true }
      );
      res.json({ user });
    }
  } catch (error) {
    throw new Error(error);
  }
});

const ratingProduct = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, producId, comment } = req.body;
  try {
    const product = await productModel.findById(producId);
    let alreadyRated = product.ratings.find(
      (userId) => userId.postedby.toString() === _id.toString()
    );

    if (alreadyRated) {
      const updateRating = await productModel.updateOne(
        {
          ratings: { $elemMatch: alreadyRated },
        },
        {
          $set: { "ratings.$.star": star, "ratings.$.comment": comment },
        },
        {
          new: true,
        }
      );
    } else {
      const rateProd = await productModel.findByIdAndUpdate(
        producId,
        {
          $push: {
            ratings: {
              star,
              comment,
              postedby: _id,
            },
          },
        },
        {
          new: true,
        }
      );
    }

    const getAllRatings = await productModel.findById(producId);
    let totalRatings = getAllRatings.ratings.length;
    let ratingsum = getAllRatings.ratings.reduce(
      (prev, curr) => prev + curr.star,
      0
    );

    let actualRating = Math.round(ratingsum / totalRatings);
    let productF = await productModel.findByIdAndUpdate(
      producId,
      {
        totalRaiting: actualRating,
      },
      { new: true }
    );
    return res.json({ productF });
  } catch (error) {
    throw new Error(error);
  }
});

const uploadProdImage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const uploader = (path) => cloudinaryUploading(path, "images");
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path);
      urls.push(newPath);
    }

    const findProduct = await productModel.findByIdAndUpdate(id, {
      images: urls.map(
        (file) => {
          return file;
        },
        { new: true }
      ),
    });

    res.json({ findProduct });
  } catch (error) {
    throw new Error(error);
  }
});

const searchProduct = asyncHandler(async (req, res) => {});

module.exports = {
  ProductCreate,
  getAllProduct,
  getOneProduct,
  updateProduct,
  deleteProduct,
  searchProduct,
  addWishList,
  ratingProduct,
  uploadProdImage,
};
