const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../services/mail.services");
const redisClient = require("../services/chache.services");
const emailTemplates = require("../utils/emailTemplate");

async function regiterUser(req,res) {
 try {
        const { fullName, email, userName, mobile, password } = req.body;
        
      
    if(!fullName || !email || !userName || !mobile || !password){
        return res.status(400).json({
            message: "all fields are required"
        })
    }

    const isUserAlreadyExits = await userModel.findOne({ 
        $or: [{email}, {userName}, {mobile}]
    })
    if(isUserAlreadyExits){
        return res.status(409).json({
            message: "user already exits"
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
       fullName,
       email,
       userName,
       mobile,
       password: hashedPassword
    })

    const token  = jwt.sign({id: newUser._id}, process.env.JWT_SECRET , {expiresIn: "1h",})

    res.cookie("token", token)

    res.status(201).json({
        message: "user created successfully",
        user: newUser
    })
 } catch (error) {
    console.log(error,"error in register")
      return res.status(500).json({
        message: "internal server error"
    })
 }
}

async function loginUser(req,res) {
   try {
     const { identifier, password } = req.body;

    if( (!identifier) || !password ){
        return res.status(400).json({
             message: "Please provide email OR username OR mobile, and password"
        })
    }

    const user = await userModel.findOne({ 
        $or: [ {email: identifier}, {userName: identifier}, {mobile: identifier} ]
    })
    if(!user){
        return res.status(404).json({
            message: "user not found"
        })
    }

    const decryptPassword = await bcrypt.compare(password, user.password);

    if(!decryptPassword){
        return res.status(401).json({
            message: "Inavlid Creadintails"
        })
    }

    const token  = jwt.sign({id: user._id},process.env.JWT_SECRET, {expiresIn: "1h"})

    res.cookie("token", token)

    res.status(200).json({
        message: "user login successfully",
        token,
        user,
    })
   } catch (error) {
     return res.status(500).json({
        message: "internal server error"
     })
   }
}


async function logoutUser(req, res) {
   try {
     const token = req.cookies?.token;
    if(!token){
        return res.status(404).json({
            message: "token not found"
        })
    }

    await redisClient.set(token, "blacklisted", "EX", 3600);
    res.clearCookie("token");

    return res.status(200).json({
        message: "logout successfully"
    })
   } catch (error) {
    console.log(error,"error in logout")
      return res.status(500).json({
      message: "Internal server error",
      error: error,
    });
   }
}


const forgotPasswordController = async (req, res) => {
  try {
    const { email, mobile } = req.body;

     if(!email || !mobile){
        return res.status(400).json({
            message: "all fields are required"
        })
     }
    const user = await userModel.findOne({
        $or: [{email}, {mobile}]
    })
    

    if(!user){
        return res.status(404).json({
            message: "user not found"
        })
    }

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "1h"})

    const resetLink = `http://localhost:3000/api/auth/reset-password/${token}`;
    const userName = user.userName;

    const resetTemplate = emailTemplates({userName, resetLink})

     const emailResult = await sendEmail(
        "jarihd4321@gmail.com",
        "reset passowrd",
        resetTemplate
     )

     console.log(emailResult)
    return res.send("ok");

  } catch (error) {
    console.log(error,"error")
    return res.status(500).json({
        message: "internal server error"
    })
  }
};


module.exports = {
    regiterUser,
    loginUser,
    forgotPasswordController,
    logoutUser
}