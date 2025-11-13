const express = require("express");
const router = express.Router();
const multer = require("multer");
const authMiddleware = require("../middleware/auth.middleware");
const storyControllers = require("../controllers/story.controllers");


const upload = multer({
    storage: multer.memoryStorage()
})

router.post("/create-story", 
    authMiddleware,
    upload.array("images", 5),
    storyControllers.createStory
 )

router.get("/view-story/:id", authMiddleware, storyControllers.viewStories)
router.get("/all-story", authMiddleware, storyControllers.getAllStories)
module.exports = router;