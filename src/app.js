const express = require("express");
const authRouter = require("./router/auth.routes");
const postRouter = require("./router/post.routes");
const userRouter = require("./router/user.routes");
const storyRoutes = require("./router/story.routes");
const commentRoutes = require("./router/comment.routes");
const ReelCommentRoutes = require("./router/reelComment.routes");
const reelRoutes = require('./router/reel.routes');
const cookieParser = require("cookie-parser");
const path = require("path");
const app = express();
const cors = require("cors");



app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));

app.use(cors({
    origin: "http://localhost:5173", // frontend ka URL
    credentials: true,               // allow credentials (cookies)
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/auth", authRouter);
app.use("/api", postRouter);
app.use("/api/user", userRouter);
app.use("/api", storyRoutes)
app.use("/api", commentRoutes);
app.use("/api", reelRoutes);
app.use("/api", ReelCommentRoutes)

module.exports = app;