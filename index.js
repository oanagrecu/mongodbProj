import mongoose from "mongoose";
import express from "express";
import ejs from "ejs";
import User from "./models/users.js";
import Comment from "./models/comments.js";
import Post, { createAndSavePost } from "./models/posts.js";

const app = express();

const uri =
  "mongodb+srv://oanaalexandragrecu:8bubzP7JwrDSJCY4@cluster1.uq4kuya.mongodb.net/media?retryWrites=true&w=majority";

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 3000;

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    retryWrites: true,
    w: "majority",
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
    createAndSavePost(); // Create a sample post when the server starts
  })
  .catch((err) => console.log(err));

// Routes for user registration, post creation, and user-specific posts
app.get("/register", (req, res) => {
  res.render("users"); // Render the user registration form
});

app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const newUser = new User({
      username,
      email,
      password,
    });

    await newUser.save();

    res.redirect("/register");
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send("An error occurred");
  }
});

app.get("/user/:username/posts", async (req, res) => {
  try {
    const username = req.params.username;

    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Find posts associated with the user and populate the user information
    const posts = await Post.find({ user: user._id }).populate(
      "user",
      "username"
    );

    res.render("user-posts", { user, posts }); // Render the user's posts EJS page
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).send("An error occurred");
  }
});

app.get("/user/:username/create-post", (req, res) => {
  const username = req.params.username;
  res.render("create-post", { username }); // Render the create post form
});

app.post("/user/:username/create-post", async (req, res) => {
  try {
    const username = req.params.username;
    const { title, body, commentText } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Create a new post associated with the user
    const newPost = new Post({
      user: user._id,
      title,
      body,
    });

    const savedPost = await newPost.save();

    // Create a new comment associated with the post
    const newComment = new Comment({
      user: user._id,
      post: savedPost._id,
      text: commentText,
    });

    await newComment.save();

    res.redirect(`/user/${username}/posts`);
  } catch (error) {
    console.error("Error creating post and comment:", error);
    res.status(500).send("An error occurred");
  }
});
