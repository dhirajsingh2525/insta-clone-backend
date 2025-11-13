const postModel = require("../models/post.model");
const commentModel = require("../models/comment.model");


async function addComment(req, res) {
     try {
    const { postId } = req.params;
    const { text } = req.body;
    const userId = req.user._id;

    const post = await postModel.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = await commentModel.create({ 
        post: postId,
        user: userId,
        text
         });

    await comment.populate("user", "fullName");

    res.status(200).json({ 
        message: "Comment added",
         comment
         });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
}

async function getAllComments(req,res) {
      try {
    const { postId } = req.params; 

    
    const comments = await commentModel.find({ post: postId })
      .populate("user", "fullName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "All comments fetched successfully ",
      comments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
}

async function deleteComments(req,res) {
    try {
    const { commentId } = req.params; 
    const userId = req.user._id;  

    const comment = await commentModel.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    
    if (comment.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    
    await commentModel.findByIdAndDelete(commentId);

   
    await postModel.findByIdAndUpdate(comment.post, {
      $pull: { comments: commentId },
    });

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }

}

module.exports = {
    addComment,
    getAllComments,
    deleteComments
}