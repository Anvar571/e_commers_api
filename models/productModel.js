const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    slug:{
        type:String,
        required:true,
        lowercase: true
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    category: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
    },
    sold: {
        type: Number,
        default: 0
    },
    
    images: [],

    color: {
        type: String,
        default: ""
    },
    ratings: [{
        star: Number,
        comment: String,
        postedby: {type: mongoose.Types.ObjectId, ref: "User"}
    }],
    totalRaiting: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

//Export the model
module.exports = mongoose.model('product', productSchema);