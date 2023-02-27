const jwt = require("jsonwebtoken");

const generateToken = (id) => {
    // 2 kunlik token 
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "2d"})
}

module.exports = {
    generateToken
}