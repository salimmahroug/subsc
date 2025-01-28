require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

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
app.use("/api",auth, userRoutes);
app.use("/api", categorieRoutes);
app.use("/api",auth, paymentRoutes);
app.use("/api", auth, admissionRoutes);
app.use("/api", auth, rentableRoutes);

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("Database connection error:", err));

  const PORT = process.env.PORT || 5000; 
  app.listen(PORT, () => console.log("Server is running on port", PORT));
  
