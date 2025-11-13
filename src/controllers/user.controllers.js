const userModel = require("../models/user.model");

async function followUser(req,res) {
  try {
     const user_id = req.params.user_id;

     if(!user_id){
        return res.status(400).json({
            message: "bad request"
        })
     }
   console.log("follow route hit hua h")
     
   const loggedInUser = await userModel.findById( req.user._id )
   if(!loggedInUser.following.includes(user_id)){
   loggedInUser.following.push(user_id)
   loggedInUser.save();
   }

   const followedUser = await userModel.findById(user_id)
   if(!followedUser.followers.includes(req.user._id)){
   followedUser.followers.push(req.user._id)
   followedUser.save();
   }

   return  res.status(200).json({
    message: "follwing successfully"
   })
  } catch (error) {
    console.log(error,"error")
    return res.status(500).json({
        message: "internal server error"
    })
  }
   
}

async function unFollowUser(req,res) {
  try {
     const user_id = req.params.user_id;

     if(!user_id){
        return res.status(400).json({
            message: "bad request"
        })
     }

     
   const loggedInUser = await userModel.findById( req.user._id )
   loggedInUser.following.splice(user_id, 1)
   loggedInUser.save();

   const unFollowedUser = await userModel.findById(user_id)
   unFollowedUser.followers.splice(req.user._id, 1)
   unFollowedUser.save();

   return  res.status(200).json({
    message: "unFollow successfully"
   })
  } catch (error) {
    console.log(error,"error")
    return res.status(500).json({
        message: "internal server error"
    })
  }
   
}

async function blockedUser(req,res) {
  try {
      const user_id = req.params.user_id;

       if(!user_id){
        return res.status(400).json({
            message: "bad request"
        })
     }
    

    const loggedInUser = await userModel.findById(req.user._id);
    if(!loggedInUser.blockedUsers.includes(user_id)){
    loggedInUser.blockedUsers.push(user_id)
    loggedInUser.save();
    }


    return  res.status(200).json({
    message: "blocked successfully"
   })

  } catch (error) {
    return res.status(500).json({
        message: "internal server error"
    })
  }
}

async function unBlockedUser(req,res) {
  try {
      const user_id = req.params.user_id;

       if(!user_id){
        return res.status(400).json({
            message: "bad request"
        })
     }
    

    const loggedInUser = await userModel.findById(req.user._id);
    loggedInUser.blockedUsers.splice(user_id, 1)
    loggedInUser.save();
    


    return  res.status(200).json({
    message: "unblocked successfully"
   })

  } catch (error) {
    return res.status(500).json({
        message: "internal server error"
    })
  }
}

async function getAllUsers(req,res) {
 try {
    const currentUser = req.user._id;

  const allusers = await userModel.find({_id: {$ne: currentUser}})

  return res.status(200).json({
    message: "fetch all users",
    allusers: allusers
  })
 } catch (error) {
  return res.status(500).json({
    message: "internal server error"
  })
 }
}


module.exports = {
    followUser,
    unFollowUser,
    blockedUser,
    unBlockedUser,
    getAllUsers
}