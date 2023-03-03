const mongoose = require('mongoose');

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "product"
            },
            count: Number,
            color: String
        }
    ],
    paymentIntent: {},
    orderStatus: {
        type: String,
        default: "Not processed",
        enum: ["Not processed", "Cash on Delevery", "Processing", "Dispatched", "Cancelled", "Delivered"],
    },
    orderBy: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true});

//Export the model
module.exports = mongoose.model('order', orderSchema);