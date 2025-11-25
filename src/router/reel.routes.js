const express = require("express");
const router = express.Router();
const multer = require("multer");
const authMiddleware = require("../middleware/auth.middleware");
const reelController = require("../controllers/reel.controllers");


const upload = multer({
    storage: multer.memoryStorage()
})


router.post("/create-reel", authMiddleware, upload.single("video"),  reelController.uploadReels)
router.get("/get-allreels", authMiddleware, reelController.getAllReels);
router.get("/get-userreel", authMiddleware, reelController.getUserReel)
router.post("/reels/like/:reelId", authMiddleware, reelController.likeOrUnlikeReel);


module.exports = router;