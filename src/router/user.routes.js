const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const userControllers = require("../controllers/user.controllers");
const multer = require("multer");
const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage()
})

router.get("/get", authMiddleware, userControllers.getAllUsers)
router.post("/follow/:user_id", authMiddleware, userControllers.followUser)
router.post("/unfollow/:user_id", authMiddleware, userControllers.unFollowUser)
router.get("/blocked/:user_id", authMiddleware, userControllers.blockedUser)
router.get("/unblocked/:user_id", authMiddleware, userControllers.unBlockedUser)
router.post("/update-profile", upload.single("profilePic"),  authMiddleware, userControllers.updateProfile);
router.get("/search",  userControllers.searchUsers);

module.exports = router;