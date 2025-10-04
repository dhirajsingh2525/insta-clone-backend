const express = require("express");
const authRouter = require("./router/auth.routes");
const postRouter = require("./router/post.routes");
const userRouter = require("./router/user.routes");
const cookieParser = require("cookie-parser");
const path = require("path");
const app = express();
const cors = require("cors");



app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));

app.use(cors());

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/auth", authRouter);
app.use("/api", postRouter);
app.use("/api/user", userRouter);

module.exports = app;