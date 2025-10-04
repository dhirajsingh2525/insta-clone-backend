const express = require("express");
//const upload = require("../middleware/upload.middleware");
const postController = require("../controllers/post.controllers");
const authMiddleware = require("../middleware/auth.middleware");
const router = express.Router();
const multer = require("multer");


const upload = multer({
    storage: multer.memoryStorage()
})


router.post("/create-post",
     upload.array("image", 2),
    postController.createPost)

router.get("/all-post", postController.getAllPost)
router.get("/user-post", postController.getUserPost)
router.put("/update-post/:id",postController.updatePost);
router.delete("/delete-post/:id",postController.updatePost);

module.exports = router;