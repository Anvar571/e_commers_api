const { 
    createblogCategory, 
    updateblogCategory, 
    deleteblogCategory, 
    getallblogCategory, 
    getOneblogCategory 
} = require("../controller/blogCategoryCtrl");

const { 
    authMiddleware, 
    isAdmin 
} = require("../middlewares/authMiddleware");


const router = require("express").Router();

router.post("/create", authMiddleware, isAdmin, createblogCategory);
router.put("/:id", authMiddleware, isAdmin, updateblogCategory);
router.delete("/:id", authMiddleware, isAdmin, deleteblogCategory);
router.get("/allcategory", getallblogCategory);
router.get("/:id", getOneblogCategory);

module.exports = router