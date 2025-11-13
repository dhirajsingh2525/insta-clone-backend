const express = require("express");
const reelCommentController = require("../controllers/reelComment.controllers");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/reel/addComments/:reelId", authMiddleware, reelCommentController.addReelComment);
router.get("/reel/getComments/:reelId", authMiddleware, reelCommentController.getReelComments);
router.delete("/reel/deleteComments/:commentId", authMiddleware, reelCommentController.deleteReelComment);

module.exports = router;
