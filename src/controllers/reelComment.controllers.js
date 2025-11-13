const reelModel = require("../models/reel.model");
const reelCommentModel = require("../models/reelComment.model");

async function addReelComment(req, res) {
  try {
    const { reelId } = req.params;
    const { text } = req.body;
    const userId = req.user._id;

     if (!reelId) {
      return res.status(400).json({ message: "Missing reelId in params" });
    }

    const reel = await reelModel.findById(reelId);
    if (!reel) return res.status(404).json({ 
        message: "Reel not found"
     });

    const comment = await reelCommentModel.create({
      reel: reelId,
      user: userId,
      text,
    });

    reel.comment.push(comment._id);
    await reel.save();

    await comment.populate("user", "fullName userName");

    res.status(200).json({
      message: "Comment added successfully",
      comment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
        message: "Something went wrong"
     });
  }
}

async function getReelComments(req, res) {
  try {
    const { reelId } = req.params;

    const comments = await reelCommentModel
      .find({ reel: reelId })
      .populate("user", "fullName userName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Reel comments fetched successfully",
      comments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
        message: "Something went wrong"
     });
  }
}

async function deleteReelComment(req, res) {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await reelCommentModel.findById(commentId);
    if (!comment) return res.status(404).json({ 
        message: "Comment not found"
     });

    if (comment.user.toString() !== userId.toString()) {
      return res.status(403).json({ 
        message: "Not authorized to delete this comment"
     });
    }

    await reelCommentModel.findByIdAndDelete(commentId);

    res.status(200).json({ 
        message: "Comment deleted successfully"
     });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
        message: "Something went wrong"
     });
  }
}

module.exports = { 
    addReelComment,
     getReelComments,
      deleteReelComment
 };

