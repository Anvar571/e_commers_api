const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var cuponSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique: true
    },
    expiry: {
        type: Date,
        required: true,
        default: Date.now()
    },
    discount: {
        type: Number,
        required: true
    }
});

//Export the model
module.exports = mongoose.model('cupon', cuponSchema);