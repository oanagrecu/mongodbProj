import mongoose from "mongoose";
const Schema = mongoose.Schema;
const likeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
});

const Like = mongoose.model("Like", likeSchema);

export default Like;
