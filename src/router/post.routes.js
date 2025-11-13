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
    authMiddleware,
     upload.array("image", 5),
    postController.createPost)

router.get("/all-post", postController.getAllPost)
router.get("/user-post", authMiddleware, postController.getUserPost)
router.put("/update-post/:_id",postController.updatePost);
router.delete("/delete-post/:_id", authMiddleware, postController.deletePost);
router.get("/posts/like/:post_id", authMiddleware, postController.likePostByUser )
router.get('/posts/unliked/:post_id', authMiddleware, postController.unLikendPost)

module.exports = router;