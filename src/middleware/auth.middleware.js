const userModel = require("../models/user.model");
const redisClient = require("../services/chache.services");
const jwt = require("jsonwebtoken");


const authMiddleware = async (req,res,next) => {
    try {
        const token = req.cookies?.token;

     
        if(!token){
           return res.status(404).json({
                message: "token not found"
            })
        }


       const blacklisted = await redisClient.get(token);

       if(blacklisted){
        return res.status(401).json({
            message: "token blacklisted or expired"
        })
       }

       const decoded =  jwt.verify( token, process.env.JWT_SECRET )
       
       if(!decoded){
        return res.status(401).json({
            message: "invalid token"
        })
       }

       const user = await userModel.findById(decoded.id);

       req.user = user;
       next();
    } catch (error) {
      return res.status(500).json({
      message: "Internal server error",
      error: error,
    });
    }
}

module.exports = authMiddleware