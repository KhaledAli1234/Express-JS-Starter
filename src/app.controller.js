import path from "node:path";
import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";

import connectDB from "./DB/connection.db.js";
import { globalErrorHandling } from "./utils/response.js";
import authController from "./modules/auth/auth.controller.js";
import userController from "./modules/user/user.controller.js";

dotenv.config({
  path: path.join("./src/config/.env.prod"),
});

async function bootstrab() {
  const app = express();

  const port = process.env.PORT || 5000;

  const limiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 20000,
    standardHeaders: "draft-8",
  });

  app.use(cors());
  app.use(helmet());
  app.use(morgan("dev"));

  await connectDB();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/uploads", express.static(path.resolve("./src/uploads")));

  app.get("/", (req, res) => {
    return res.json({
      message: "Welcome to Express JS Starter 🚀",
    });
  });

  app.get("/health", (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Server is healthy",
    });
  });

  app.use("/auth", limiter, authController);
  app.use("/user", userController);

  app.all("{/*dummy}", (req, res) => {
    return res.status(404).json({
      message: "Invalid routing",
    });
  });

  app.use(globalErrorHandling);

  return app.listen(port, () => {
    console.log(`Server is running on port ${port} 🚀`);
  });
}

export default bootstrab;
