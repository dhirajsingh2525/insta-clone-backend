const express = require("express");
const userControllers = require("../controllers/auth.controllers");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/auth.middleware");
const userModel = require("../models/user.model");
const router = express.Router();

router.get("/reset-password/:token", (req,res) => {
   const token = req.params.token;

    if(!token){
        return res.status(400).json({
            message:"token are not found"
        })
    }

    const decoded = jwt.verify(token, "ghi9t6tevgdhdbjkot9507f3gdvdygh");
    res.render("index", {user_id: decoded.id})

})

router.post("/update-password/:id", async (req,res) => {
   try {
     const id = req.params.id;
    const password = req.body.password;

    if(!id){
        return res.status(404).json({
            message: "id not found"
        })
    }

    const updatedUser = await userModel.findByIdAndUpdate(
        { _id: id },
        { password }
    )

    return res.status(200).json({
        message: "update password",
        user: updatedUser
    })
   } catch (error) {
      return res.status(500).json({
        message: "internal server error"
    })
   }

})



router.post("/user/register", userControllers.regiterUser);
router.post("/user/login", userControllers.loginUser);
router.post("/user/logout", authMiddleware, userControllers.logoutUser);
router.post("/forgot-password", userControllers.forgotPasswordController);


module.exports = router;