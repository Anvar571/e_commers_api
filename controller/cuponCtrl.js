const asyncHandler = require("express-async-handler");
const cuponModel = require("../models/cuponModel");

const createCupon = asyncHandler(async (req, res) => {
    try {
        const cupon = await cuponModel.create(req.body)
        res.json({
            cupon
        })
    } catch (error) {
        throw new Error(error);
    }
})

const updateCupon = asyncHandler(async (req, res) => {
    const {id} = req.params
    try {
        const cupon = await cuponModel.findByIdAndUpdate(id, req.body);
        res.json({
            cupon
        })
    } catch (error) {
        throw new Error(error);
    }
})

const deleteCupon = asyncHandler(async (req, res) => {
    const {id} = req.params;
    try {
        await cuponModel.findByIdAndDelete(id)
        res.json({
            message: "delete success"
        })
    } catch (error) {
        throw new Error(error);
    }
})

const getAllCupon = asyncHandler(async (req, res) => {
    try {
        const cupon = await cuponModel.find({});
        res.json({
            cupon
        })
    } catch (error) {
        throw new Error(error);
    }
})

module.exports = {
    createCupon,
    updateCupon,
    deleteCupon,
    getAllCupon
}