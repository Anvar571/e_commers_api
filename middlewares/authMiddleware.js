const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");

const authMiddleware = asyncHandler(async (req, res, next) => {
    let token;
    if (req.header("Authorization")) {
        token = req.header("Authorization");

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await UserModel.findById(decoded.id);
            req.user = user
            next();
        } catch (error) {
            throw new Error("Please login or you are not authorized token");
        }
    }else {
        throw new Error("There is no token");
    }
})

const isAdmin = asyncHandler(async (req, res, next) => {
    const {email} = req.user;
    const admin = await UserModel.findOne({email});
    if (admin.role !== "admin") {
        throw new Error("You are not an admin")
    }else{
        next();
    };
})

module.exports = {authMiddleware, isAdmin}