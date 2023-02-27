const mongoose = require('mongoose');
const bcrypt = require("bcrypt")
const crypto = require("crypto");
// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role: {
        type: String,
        default: "user"
    },
    blockUser: {
        type: Boolean,
        default: false
    },
    cart: {
        type: Array,
        default: []
    },
    address: [{type: mongoose.Types.ObjectId, ref: "address"}],
    wishlist: [{type: mongoose.Types.ObjectId, ref: "product"}],
    refreshtoken: {
        type: String
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
}, {
    timestamps: true
});

// 
userSchema.pre("save", async function (next){
    if (!this.isModified("password")){
        next()
    }
    const salt = bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
    next()
})

// add coustum method
userSchema.methods.isComparePass = async function(hashPass, password) {
    return await bcrypt.compare(password, hashPass);
}
userSchema.methods.createResetToken = async function(){
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto.createHash("sha256")
    .update(resetToken)
    .digest("hex");
    this.passwordResetExpires = Date.now() + 30 * 60*1000// 10 min
    return resetToken;
}

//Export the model
module.exports = mongoose.model('User', userSchema);