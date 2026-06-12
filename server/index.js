const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Health check — must be before redirect engine
app.get("/", (req, res) => {
  res.json({ message: "Traxly API is running" });
});

// API routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/links", require("./routes/linkRoutes"));

// Redirect engine — must be LAST
app.use(
  "/:shortCode",
  require("./controllers/redirectController").handleRedirect
);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));