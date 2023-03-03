const asyncHandler = require("express-async-handler");
const categoryModule = require("../models/categoryModel");

const createCategory = asyncHandler(async (req, res) => {
    try {
        const category = await categoryModule.create(req.body);
        res.json(category);
    } catch (error) {
        throw new Error(error);
    }
})

const updateCategory =  asyncHandler(async (req, res) => {
    const {id} = req.params;
    try {
        const updateCategory = await categoryModule.findByIdAndUpdate(id, req.body);
        res.json({
            message: "update success",
            updateCategory
        })
    } catch (error) {
        throw new Error(error)
    }
})

const deleteCategory = asyncHandler(async (req, res) => {
    const {id} = req.params;
    try {
        await categoryModule.findByIdAndDelete(id);
        res.json({
            message: "category deleted success" 
        })
    } catch (error) {
        throw new Error(error);
    }
})

const getallCategory = asyncHandler(async (req, res) => {
    try {
        const getallCategory = await categoryModule.find({});
        res.json({getallCategory});
    } catch (error) {
        throw new Error(error)
    }
})

const getOneCategory = asyncHandler(async (req, res) => {
    const {id} = req.params
    try {
        const getOneCategory = await categoryModule.findById(id)
        res.json({getOneCategory});
    } catch (error) {
        throw new Error(error)
    }
})

module.exports = {
    createCategory,
    updateCategory,
    deleteCategory,
    getallCategory,
    getOneCategory
}
