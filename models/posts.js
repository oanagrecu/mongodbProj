import mongoose from "mongoose";
import User from "./users.js";

const Schema = mongoose.Schema;

const postSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: String,
  body: String,
  image: String,
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});

const Post = mongoose.model("Post", postSchema);
export default Post;
