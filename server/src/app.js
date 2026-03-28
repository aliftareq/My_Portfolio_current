import express from "express";
import cors from "cors";
import morgan from "morgan";

import uploadRoutes from "./routes/uploadRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Portfolio API is running");
});

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server is healthy" });
});


//routes 
app.use("/api", uploadRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/profile", profileRoutes);

export default app;