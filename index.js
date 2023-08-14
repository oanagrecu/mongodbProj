import mongoose from "mongoose";
import express from "express";
import session from "express-session";
import passport from "passport";
import LocalStrategy from "passport-local";

import dotenv from "dotenv";
import User from "./models/users.js";
import Post from "./models/posts.js";
import Comment from "./models/comments.js";
import bcrypt from "bcrypt";
dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;
const sessionSecret = process.env.SESSION_SECRET;
app.use(express.static("public"));
// Set up middlewares
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");
mongoose
  .connect(
    "mongodb+srv://oanaalexandragrecu:8bubzP7JwrDSJCY4@cluster1.uq4kuya.mongodb.net/media?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: true,
      w: "majority",
    }
  )
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Generated hashed password:", hashedPassword);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.redirect("/login"); // Redirect to login after registration
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).render("error", {
      errorMessage: "An error occurred during registration.",
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("Attempting login for username:", username);

    const user = await User.findOne({ username });

    if (!user) {
      console.log("User not found:", username);
      return res.status(401).render("error", {
        errorMessage: "Invalid credentials.",
      });
    }
    console.log("Database hashed password:", user.password);
    console.log("Generated hashed password:", await bcrypt.hash(password, 10));

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      console.log("Invalid password for user:", username);
      return res.status(401).render("error", {
        errorMessage: "Invalid credentials.",
      });
    }

    req.session.user = user;
    console.log("Login successful for user:", username);
    res.redirect(`/user/${username}/posts`); // Redirect after successful login
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).render("error", {
      errorMessage: "An error occurred during login.",
    });
  }
});

app.get("/user/:username/posts", async (req, res) => {
  try {
    const username = req.params.username;
    console.log("Searching for user:", username);
    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      console.log("User not found:", username);
      return res.status(404).send("User not found");
    }

    // Find posts associated with the user
    const posts = await Post.find({ user: user._id });
    console.log("User posts:", posts);

    if (posts.length > 0) {
      // User has posts, render user-posts.ejs
      res.render("user-posts", { user, posts });
    } else {
      // User does not have posts, redirect to create-post.ejs
      res.redirect(`/user/${username}/create-post`);
    }
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
    const { title, body, image } = req.body;

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
      image,
      comments: [],
    });

    await newPost.save();

    res.redirect(`/user/${username}/posts`);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).send("An error occurred");
  }
});
app.post("/user/:username/create-comment/:postId", async (req, res) => {
  try {
    const { username, postId } = req.params;
    const { text } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Find the post by postId
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).send("Post not found");
    }

    // Create a new comment associated with the user and post
    const newComment = new Comment({
      user: user._id,
      post: post._id,
      text,
    });

    await newComment.save();

    res.redirect(`/user/${username}/posts`);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).send("An error occurred");
  }
});
