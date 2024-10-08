const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

// Using Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS
// Allow all origins to access the server
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Import all routes
const users = require("./routes/user");
const posts = require("./routes/post");
// Using routes
app.use("/api/v1", users);
app.use("/api/v1", posts);
module.exports = app;
