const express = require("express");
const router = express.Router();
const postController = require("../controllers/comment.controllers");
const authMiddleware = require("../middleware/auth.middleware");



router.post("/comment/:postId", authMiddleware, postController.addComment);


router.get("/comment/:postId", authMiddleware, postController.getAllComments);


router.delete("/comment/:commentId", authMiddleware, postController.deleteComments);

module.exports = router;
