const { 
    createUser, 
    loginUserCtrl, 
    getAllUser, 
    getByIdUser, 
    deleteUser, 
    updateUser, 
    blockUser, 
    unBlockUser, 
    refreshTokenHandler, 
    logout,
    updatePassword,
    getCurrentUser,
    forget_password,
    adminLogin,
    getallWishList,
    userCart,
    getUserCart,
    emptyCart,
    applyCoupon
} = require("../controller/UserCtrl");

const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const router = require("express").Router();

router.post("/register", createUser);
router.post("/login", loginUserCtrl);
router.post("/admin-login", adminLogin);
router.put("/password", authMiddleware, updatePassword);
router.post("/forgot-password", forget_password);
router.post("/reset-password/:token", forget_password);
router.post("/cart", authMiddleware, userCart);
router.post("/cart/coupon", authMiddleware, applyCoupon);

router.get("/cart", authMiddleware, getUserCart);
router.get("/refreshtoken", refreshTokenHandler);
router.get("/alluser", getAllUser);
router.get("/me", authMiddleware, getCurrentUser);
router.get("/logout", logout);
router.get("/wish-list", authMiddleware, getallWishList);
router.get("/:id", authMiddleware, getByIdUser);

router.delete("/empty-cart", authMiddleware, emptyCart);
router.delete("/:id", deleteUser);

router.put("/edit", authMiddleware, updateUser);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin , unBlockUser);

module.exports = router