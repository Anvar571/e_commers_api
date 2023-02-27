const mongoose = require("mongoose")

const db_connection = () => {
    try {
        mongoose.connect(process.env.DB_URL);
        console.log("connecting db is successfully");
    } catch (error) {
        console.log(error);
    }
}

module.exports = db_connection