const asyncHandler = require("express-async-handler");
const blogcategory = require("../models/blogCategoryModel");

const createblogCategory = asyncHandler(async (req, res) => {
    try {
        const category = await blogcategory.create(req.body);
        res.json(category);
    } catch (error) {
        throw new Error(error);
    }
})

const updateblogCategory =  asyncHandler(async (req, res) => {
    const {id} = req.params;
    try {
        const updateCategory = await blogcategory.findByIdAndUpdate(id, req.body);
        res.json({
            message: "update success",
            updateCategory
        })
    } catch (error) {
        throw new Error(error)
    }
})

const deleteblogCategory = asyncHandler(async (req, res) => {
    const {id} = req.params;
    try {
        await blogcategory.findByIdAndDelete(id);
        res.json({
            message: "category deleted success" 
        })
    } catch (error) {
        throw new Error(error);
    }
})

const getallblogCategory = asyncHandler(async (req, res) => {
    try {
        const getallCategory = await blogcategory.find({});
        res.json({getallCategory});
    } catch (error) {
        throw new Error(error)
    }
})

const getOneblogCategory = asyncHandler(async (req, res) => {
    const {id} = req.params
    try {
        const getOneCategory = await blogcategory.findById(id)
        res.json({getOneCategory});
    } catch (error) {
        throw new Error(error)
    }
})

module.exports = {
    createblogCategory,
    updateblogCategory,
    deleteblogCategory,
    getallblogCategory,
    getOneblogCategory
}
