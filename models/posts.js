import mongoose from "mongoose";
import User from "./users.js";
import Comment from "./comments.js";

const Schema = mongoose.Schema;

const postSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: String,
  body: String,
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});

const Post = mongoose.model("Post", postSchema);
export default Post;

const createAndSavePost = async () => {
  try {
    console.log("Before findOne operation");

    const foundUser = await User.findOne({ username: "oana" });

    console.log("After findOne operation");

    if (!foundUser) {
      throw new Error("User not found");
    }

    const newPost = new Post({
      user: foundUser._id,
      title: "This is a new post.",
      body: "I have created a new post on the blog",
      comments: [],
    });

    const savedPost = await newPost.save();
    console.log("New post saved:", savedPost);
  } catch (error) {
    console.error("Error creating post:", error);
  }
};
createAndSavePost();

export { createAndSavePost };
