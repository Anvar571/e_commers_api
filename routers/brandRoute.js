const { 
    createBrand, 
    updateBrand, 
    deleteBrand, 
    getallBrand, 
    getOneBrand 
} = require("../controller/brandCtrl");

const { 
    authMiddleware, 
    isAdmin 
} = require("../middlewares/authMiddleware");

const router = require("express").Router();

router.post("/create", authMiddleware, isAdmin, createBrand);
router.put("/:id", authMiddleware, isAdmin, updateBrand);
router.delete("/:id", authMiddleware, isAdmin, deleteBrand);
router.get("/allbrand", getallBrand);
router.get("/:id", getOneBrand);

module.exports = router