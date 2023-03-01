const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    numViews:{
        type:String,
        default: 0
    },
    isLiked:{
        type: Boolean,
        default: false
    },
    isDisLiked: {
        type: Boolean,
        default: false
    },
    likes: [
        {
            type: mongoose.Types.ObjectId,
            ref: "user"
        }
    ],
    disLikes: [
        {
            type: mongoose.Types.ObjectId,
            ref: "user"
        }
    ],
    image: {
        type: String,
        default: ""
    },
    author: {
        type: String,
        default: "Admin"
    }
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
    timestamps: true
});

//Export the model
module.exports = mongoose.model('blog', blogSchema);