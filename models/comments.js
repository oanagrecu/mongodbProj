import mongoose from "mongoose";
import User from "./users.js";
import Post from "./posts.js";
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    text: String,
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;

const createAndSaveComment = async () => {
  try {
    const foundUser = await User.findOne({ username: "oana" });
    const foundPost = await Post.findOne({
      title: "This is a new post.",
    });

    if (!foundUser || !foundPost) {
      throw new Error("User or post not found");
    }

    const newComment = new Comment({
      user: foundUser._id,
      post: foundPost._id,
      text: "This is a sample comment.",
    });

    const savedComment = await newComment.save();
    console.log("New comment saved:", savedComment);
  } catch (error) {
    console.error("Error creating comment:", error);
  }
};

export { createAndSaveComment };
