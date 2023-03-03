const UserModel = require("../models/UserModel");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const ValidationMongodb = require("../utils/Validation");
const generateRefreshToken = require("../config/refreshToken");
const jwt = require("jsonwebtoken");
const { hashPassword, comparePassword } = require("../modules/bcrypt");
const sendEmail = require("./emailCtrl");
const crypto = require("crypto");
const cartModule = require("../models/cartModule");
const productModel = require("../models/productModel");
const cuponModel = require("../models/cuponModel");

const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await UserModel.findOne({ email });

  if (!findUser) {
    const newUser = await UserModel.create(req.body);
    res.json({
      message: "User registered",
      newUser,
    });
  } else {
    throw new Error("This email already registered");
  }
});

const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const findUser = await UserModel.findOne({ email });
  const refreshtoken = await generateRefreshToken(findUser?._id);

  await UserModel.findByIdAndUpdate(
    findUser.id,
    {
      refreshtoken,
    },
    { new: true }
  );

  res.cookie("refreshtoken", refreshtoken, {
    httpOnly: true,
    maxAge: 72 * 60 * 60 * 1000,
  });

  if (findUser && await findUser.isComparePass(findUser.password, password))
    return res.json({
      message: "Login successfully",
      _id: findUser?._id,
      name: findUser?.name,
      email: findUser?.email,
      password: findUser?.password,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id),
    });

  throw new Error("Invalid Email and password");
});

// login admin
const adminLogin = asyncHandler(async (req, res) => {
  const {email, password} = req.body;
  try {
    const user = await UserModel.findOne({email});
    if (!user) throw new Error("Email or password exists");
    const refreshtoken = await generateRefreshToken(user?._id);

    const hashPass = await comparePassword(user.password, password);
    if (!hashPass) throw new Error("Admin password in correct");

    res.cookie("refreshtoken", refreshtoken, {
      httpOnly: true,
      maxAge: 72*60*60*1000
    })

    await UserModel.findByIdAndUpdate(
      user?._id,
      {
        refreshtoken
      },
      {new: true}
    )

    res.json({
      message: "Loged in admin",
      _id: user?._id,
      name: user?.name,
      email: user?.email,
      password: user?.password,
      mobile: user?.mobile,
      token: generateToken(user?._id),
    })

  } catch (error) {
    throw new Error(error)
  }
})

// get all user
const getAllUser = asyncHandler(async (req, res) => {
  try {
    const getUser = await UserModel.find();
    res.json(getUser);
  } catch (error) {
    throw new Error(error);
  }
});

// get single user
const getByIdUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  ValidationMongodb(id);

  try {
    const user = await UserModel.findById(id);
    if (!user) throw new Error("This user not found");
    res.json(user);
  } catch (error) {
    throw new Error(error);
  }
});

const getCurrentUser = asyncHandler(async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  ValidationMongodb(id);

  try {
    await UserModel.findOneAndDelete({ _id: id });
    res.json({ message: "delete successfully" });
  } catch (error) {
    throw new Error(error);
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  try {
    const updateUser = await UserModel.findByIdAndUpdate(
      _id,
      {
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile,
        address: req.body?.address || "",
      },
      { new: true }
    );
    res.json(updateUser);
  } catch (error) {
    throw new Error(error);
  }
});

const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  ValidationMongodb(id);

  try {
    const block = await UserModel.findByIdAndUpdate(
      id,
      {
        blockUser: true,
      },
      { new: true }
    );
    res.json({
      message: "user blocked",
      block,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const unBlockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  ValidationMongodb(id);

  try {
    const unBlock = await UserModel.findByIdAndUpdate(
      id,
      {
        blockUser: false,
      },
      { new: true }
    );
    res.json({
      message: "user unblocked",
      unBlock,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const refreshTokenHandler = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshtoken) throw new Error("No refreshtoken token in cookie");
  let refreshtoken = cookie.refreshtoken;
  console.log(refreshtoken);
  refreshtoken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZmIzZGE5MGI5MzYyM2IwNjEyOWRjMSIsImlhdCI6MTY3NzQzMjk2NSwiZXhwIjoxNjc3NjkyMTY1fQ.QAvEvQpIFNuSe_S3yUQzXQMv874zhlmzQCZMMBbZyPk";

  const user = await UserModel.findOne({ refreshtoken });
  if (!user) throw new Error("No refresh token in db");

  jwt.verify(refreshtoken, process.env.JWT_SECRET, (err, decoded) => {
    console.log(decoded);
    if (err || user.id !== decoded.id) {
      throw new Error("Refresh tokenda qandaydir xatolik bor");
    }
    const accesstoken = generateToken(user?._id);
    res.json({ accesstoken });
  });
});

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  const refreshtoken = cookie.refreshtoken;
  const user = await UserModel.findOne({ refreshtoken });
  if (!user) {
    res.clearCookie("refreshtoken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204);
  }
  await UserModel.findOneAndUpdate(refreshtoken, { refreshtoken: "" });
  res.clearCookie("refreshtoken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204);
});

const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;

  if (password) {
    const hashpass = await hashPassword(password);

    let user = await UserModel.findByIdAndUpdate(_id, {password: hashpass});

    await user.save();

    res.json({
      message: "update password",
    });
  } else {
    res.json(user);
  }
});

const forget_password = asyncHandler(async (req, res) => {
  const {email} = req.body;
  const user = await UserModel.findOne({email});
  if (!user) throw new Error("User not fount");
  try {
    const token = await user.createResetToken();
    await user.save();
    const resetUrl = `Salo, Iltimos yuborilgan linkni bosing <a href="http://localhost:8000/api/auth/reset-password/${token}">Click here</a>`;
    const data = {
      to: "taxahef965@pubpng.com",
      text: "hey user",
      subject: "Forget password link",
      html: resetUrl
    }
    sendEmail(data)
    res.json(token);
  } catch (error) {
    throw new Error(error)
  }
})

const resetPassword = asyncHandler(async (req, res) => {
  const {password} = req.body;
  const token = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest('hex');
  const user = await UserModel.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: {$gt: Date.now()},
  })
  if (!user) throw new Error("Token expired, please try again");
  user.password = password;
  user.passwordResetToken = undefined
  user.passwordResetExpires = undefined
  await user.save();
  res.json(user);
})

const getallWishList = asyncHandler(async (req, res) => {
  const {_id} = req.user;
  try {
    const wishList = await UserModel.findById(_id).populate("wishlist");
    res.json({wishList})
  } catch (error) {
    throw new Error(error)
  }
})

const userCart = asyncHandler(async (req, res, next) =>{
  const {cart} =req.body;
  const {_id} = req.user;
  try {
    let products = [];
    const user = await UserModel.findById(_id);
    const checkCart = await cartModule.findOne({orderBy: user._id});
    if (checkCart) {
      checkCart.remove();
    }
    for (let i=0; i < cart.length; i++){
      let obj = {};
      obj.product = cart[i]._id;
      obj.count = cart[i].count;
      obj.color = cart[i].color;
      let getPrice = await productModel.findById(cart[i]._id).select("price").exec();
      obj.price = getPrice.price;
      products.push(obj);
    }
    
    let totalCart = 0;
    for (let i=0; i<products.length; i++){
      totalCart = totalCart + products[i].price * products[i].count;
    }
    const newCart = await new cartModule({
      products,
      cartTotal: totalCart,
      orderBy: user?._id
    }).save();

    res.json({newCart});
  } catch (error) {
    throw new Error(error);
  }

})

const getUserCart = asyncHandler(async (req, res) => {
  const {_id} = req.user;
  try {
    const cart = await cartModule.findOne({orderBy: _id})
    .populate("products.product", "_id title price totalDisCount");
    res.json(cart)
  } catch (error) {
    throw new Error(error)
  }
})

const emptyCart = asyncHandler(async (req, res) => {
  const {_id} = req.user;
  try {
    const user = await UserModel.findOne({_id});
    const cart = await cartModule.findByIdAndRemove({orderBy: user._id});
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
})

const applyCoupon = asyncHandler(async (req, res) => {
  const {coupon} = req.body;
  const {_id} = req.user;

  const validateCupon = await cuponModel.findOne({name: coupon});
  if (validateCupon === null) throw new Error("Invalid Coupon");

  const user = await UserModel.findById(_id);

let {cartTotal} = await cartModule.findOne({
    orderBy: user._id
  }).populate("products.product");

  let totalDisCount = (
    cartTotal - (cartTotal * validateCupon.discount) / 100
    ).toFixed(2);

    await cartModule.findOneAndUpdate(
      {orderBy: user._id},
      {totalDisCount},
      {new: true}
    )
    res.json(totalDisCount)
})

module.exports = {
  createUser,
  loginUserCtrl,
  getAllUser,
  getByIdUser,
  getCurrentUser,
  deleteUser,
  updateUser,
  blockUser,
  unBlockUser,
  refreshTokenHandler,
  logout,
  updatePassword,
  forget_password,
  resetPassword,
  adminLogin,
  getallWishList,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon
};
