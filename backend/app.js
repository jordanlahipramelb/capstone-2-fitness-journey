"use strict";

/** Express app for Fitness Journey */

const express = require("express");
const cors = require("cors");
const { NotFoundError } = require("./expressError");
const { authenticateJWT } = require("./middleware/auth");
const morgan = require("morgan");
const app = express();

/** Routes */
const authRoutes = require("./routes/authRoutes");
const usersRoutes = require("./routes/usersRoutes");
const exercisesRoutes = require("./routes/exercisesRoutes");
const postsRoutes = require("./routes/postsRoutes");
const postsCommentsRoutes = require("./routes/postsCommentsRoutes");
/*******/

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);

app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/exercises", exercisesRoutes);
app.use("/forum", postsRoutes);
app.use("/forum/:post_id/comments", postsCommentsRoutes);

/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
