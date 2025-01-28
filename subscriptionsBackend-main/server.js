require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Import routes
const userRoutes = require("./routers/userRoutes");
const categorieRoutes = require("./routers/categorieRoutes");
const paymentRoutes = require("./routers/paymentRoutes");
const authRoutes = require("./routers/authRoutes");
const auth = require("./middleware/auth");
const admissionRoutes = require("./routers/admissionRoutes");
const rentableRoutes = require("./routers/rentableRoutes");

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/users", auth, userRoutes);
app.use("/api/categories", categorieRoutes);
app.use("/api/payments", auth, paymentRoutes);
app.use("/api/admissions", auth, admissionRoutes);
app.use("/api/rentables", auth, rentableRoutes);

// Static files (for production)
const staticPath = path.join(__dirname, "subscriptions-main", "dist");
app.use(express.static(staticPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(staticPath, "index.html"));
});

// Database connection
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("Database connection error:", err));

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));