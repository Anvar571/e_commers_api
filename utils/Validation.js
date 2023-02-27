const mongoose = require("express");

const ValidationMongodb = (id) => {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    console.log(isValid);
    if (!isValid) throw new Error("This id is not valid or not fount");
}

module.exports = ValidationMongodb;