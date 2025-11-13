const storageServices = require("../services/storage.services");
const reelModel = require("../models/reel.model");
const userModel = require("../models/user.model");

async function uploadReels(req,res) {
 try {
       const { caption } = req.body;

    if(!req.file){
        return res.status(400).json({ message: "video is requred" })
    }

    const uploadVideo = await storageServices.uploadFile(req.file.buffer);

    const upload = await reelModel.create({
        user_id: req.user._id,
        videoUrl: uploadVideo.url,
        caption
    })

    const user = await userModel.findById(req.user._id)
    user.reels.push(upload._id)
    await user.save();

    return res.status(201).json({
        message: "reels upload successfully",
        upload
    })
 } catch (error) {
    console.log(error)
 }
}

async function getAllReels(req, res) {
  try {
    const userId = req.user._id;

    const reels = await reelModel
      .find({})
      .populate("user_id", "fullName avatar")
      .sort({ createdAt: -1 });

    if (!reels || reels.length === 0) {
      return res.status(404).json({ message: "No reels found" });
    }

    const formattedReels = reels.map((reel) => ({
      _id: reel._id,
      videoUrl: reel.videoUrl,
      caption: reel.caption,
      user_id: reel.user_id,
      likesCount: reel.likes.length,
      isLiked: reel.likes.some(
        (id) => id.toString() === userId.toString()
      ), 
      createdAt: reel.createdAt,
    }));

    return res.status(200).json({
      message: "Reels fetched successfully",
      allReels: formattedReels,
    });
  } catch (error) {
    console.error("Error fetching reels:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}


async function getUserReel(req,res) {
    try {
        const user_id = req.user._id;
      
          
          if (!user_id)
            return res.status(404).json({
              message: "User Id not found",
            });
      
         const userReels = await reelModel
            .find({ user: user_id }) 
            .populate("user", "fullName")
            .sort({ createdAt: -1 });
        console.log(userReels)
      
        return res.status(200).json({
            message: "User reels found",
            userReels
          });  
    } catch (error) {
        console.log(error)
    }
}

async function getReelById(req, res) {
  try {
    const { reelId } = req.params;

    const reel = await reelModel
      .findById(reelId)
      .populate("user_id", "fullName userName")

    if (!reel) {
      return res.status(404).json({ message: "Reel not found" });
    }

    res.status(200).json({
      success: true,
      reel,
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Error fetching reel" });
  }
}

async function likeOrUnlikeReel(req, res) {
  try {
    const { reelId } = req.params;
    const userId = req.user._id;

    const reel = await reelModel.findById(reelId);
    if (!reel) {
      return res.status(404).json({ message: "Reel not found" });
    }

    const alreadyLiked = reel.likes.includes(userId);

    if (alreadyLiked) {
      reel.likes = reel.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      reel.likes.push(userId);
    }

    await reel.save();

    return res.status(200).json({
      message: alreadyLiked
        ? "Reel unliked successfully"
        : "Reel liked successfully",
      likesCount: reel.likes.length,
      isLiked: !alreadyLiked,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while liking/unliking reel" });
  }
}




module.exports = {
    uploadReels,
    getAllReels,
    getUserReel,
    getReelById,
    likeOrUnlikeReel
}