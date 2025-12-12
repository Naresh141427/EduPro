const express = require("express");
const app = express();
const cookieParser = require("cookie-parser")
const userRoutes = require("./routes/userRoutes");

app.use(express.json());
app.use(cookieParser())


app.use("/api/users", userRoutes);


app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
