const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Traxly API is running" });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/links", require("./routes/linkRoutes"));
app.use("/api/abtests", require("./routes/abTestRoutes"));
app.use("/api/apikeys", require("./routes/apiKeyRoutes"));

const { handleRedirect, verifyPassword } = require("./controllers/redirectController");
const { handleABRedirect } = require("./controllers/abTestController");

app.post("/:shortCode/verify-password", verifyPassword);
app.use("/ab/:shortCode", handleABRedirect);
app.use("/:shortCode", handleRedirect);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));