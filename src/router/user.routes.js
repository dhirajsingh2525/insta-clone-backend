const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const userControllers = require("../controllers/user.controllers");
const router = express.Router();


router.get("/get", authMiddleware, userControllers.getAllUsers)
router.post("/follow/:user_id", authMiddleware, userControllers.followUser)
router.post("/unfollow/:user_id", authMiddleware, userControllers.unFollowUser)
router.get("/blocked/:user_id", authMiddleware, userControllers.blockedUser)
router.get("/unblocked/:user_id", authMiddleware, userControllers.unBlockedUser)

module.exports = router;