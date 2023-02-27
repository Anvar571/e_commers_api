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
    getCurrentUser
} = require("../controller/UserCtrl");

const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const router = require("express").Router();

router.post("/register", createUser);
router.post("/login", loginUserCtrl);
router.put("/password", authMiddleware, updatePassword);

router.get("/refreshtoken", refreshTokenHandler);
router.get("/alluser", getAllUser);
router.get("/me", authMiddleware, getCurrentUser);
router.get("/logout", logout);
router.get("/:id", authMiddleware, isAdmin, getByIdUser);
router.delete("/:id", deleteUser);

router.put("/edit", authMiddleware, updateUser);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin , unBlockUser);



module.exports = router