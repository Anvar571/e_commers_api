const { 
    createCupon, 
    updateCupon, 
    deleteCupon, 
    getAllCupon 
} = require("../controller/cuponCtrl");

const { authMiddleware } = require("../middlewares/authMiddleware");

const router = require("express").Router();

router.post("/create", authMiddleware, createCupon);
router.put("/:id", authMiddleware, updateCupon);
router.delete("/:id", authMiddleware, deleteCupon);
router.get("/all", getAllCupon);

module.exports = router