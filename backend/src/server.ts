
import express from "express";
import cors from "cors";
import { prisma } from "./db";

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors({
  origin: "http://localhost:5173",
}));

app.use(express.json());

// Test route
app.get("/", (_req, res) => {
  res.json({
    message: "Applied API is running!",
  });
});

// Database connection test
app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      status: "ok",
      database: "connected",
    });
  } catch (error) {
    console.error("Database health check failed:", error);

    res.status(500).json({
      status: "error",
      database: "disconnected",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Applied API running at http://localhost:${PORT}`);
});
