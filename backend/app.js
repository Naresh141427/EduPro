
require("./config/env");

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors")

const errorMiddleware = require("./middlewares/errorMiddleware")
const authRoutes = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes.js")


const app = express();

// global middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

// routes
app.use("/auth", authRoutes);
app.use("/users", userRouter)

app.get("/", (req, res) => res.send("App running successfully"))



//global error middleware 
app.use(errorMiddleware)


module.exports = app;
