const mongoose = require('mongoose'); // Erase if already required

var blogCategorySchema = new mongoose.Schema({
    title : {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true
});

//Export the model
module.exports = mongoose.model('blogcategory', blogCategorySchema);

