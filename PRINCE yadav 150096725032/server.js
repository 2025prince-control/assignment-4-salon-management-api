require("dotenv").config();

const express = require("express");
const supabase = require("./config/db");


const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const salonRoutes = require("./routes/salonRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const logger = require("./middleware/logger");

const app = express();
app.use(logger);

app.use(express.json());


app.use("/salons", salonRoutes);
app.use("/", serviceRoutes);
app.use("/", authRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Welcome to Salon APIs"
    });
});

app.get("/protected", authMiddleware, (req, res) => {
    res.json({
        message: "You have access to the protected route",
        user: req.user
    });
});


async function startServer() {

    const { error } = await supabase
        .from("salons")
        .select("id")
        .limit(1);

    if (error) {
        console.log("❌ Supabase connection failed");
        console.log(error.message);
        return;
    }

    console.log("✅ Supabase database connected successfully!");

    app.listen(3000, () => {
        console.log("🚀 Server running on port 3000");
    });
}

startServer();