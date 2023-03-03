const asyncHandler = require("express-async-handler");
const brandModule = require("../models/brandModule");

const createBrand = asyncHandler(async (req, res) => {
    try {
        const category = await brandModule.create(req.body);
        res.json(category);
    } catch (error) {
        throw new Error(error);
    }
})

const updateBrand =  asyncHandler(async (req, res) => {
    const {id} = req.params;
    try {
        const updateCategory = await brandModule.findByIdAndUpdate(id, req.body);
        res.json({
            message: "update success",
            updateCategory
        })
    } catch (error) {
        throw new Error(error)
    }
})

const deleteBrand = asyncHandler(async (req, res) => {
    const {id} = req.params;
    try {
        await brandModule.findByIdAndDelete(id);
        res.json({
            message: "category deleted success" 
        })
    } catch (error) {
        throw new Error(error);
    }
})

const getallBrand = asyncHandler(async (req, res) => {
    try {
        const getallCategory = await brandModule.find({});
        res.json({getallCategory});
    } catch (error) {
        throw new Error(error)
    }
})

const getOneBrand = asyncHandler(async (req, res) => {
    const {id} = req.params
    try {
        const getOneCategory = await brandModule.findById(id)
        res.json({getOneCategory});
    } catch (error) {
        throw new Error(error)
    }
})

module.exports = {
    createBrand,
    updateBrand,
    deleteBrand,
    getOneBrand,
    getallBrand
}
