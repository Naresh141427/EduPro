
require("./config/env");

const express = require("express");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");

const app = express();

// global middleware
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/users", authRoutes);

app.get("/", (req, res) => res.send("App running successfully"))


module.exports = app;
