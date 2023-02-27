const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
    return bcrypt.hash(password, 10)
}

const comparePassword = async (hash, password) => {
    return bcrypt.compareSync(password, hash)
}

module.exports = {
    hashPassword,
    comparePassword
}