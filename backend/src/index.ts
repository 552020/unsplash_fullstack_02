import cors from "cors";
import express from "express";

import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import postRoutes from "./routes/postRoutes";
import userRoutes from "./routes/userRoutes";

dotenv.config();

const PORT = process.env.PORT || 3001;
export const JWT_SECRET = process.env.JWT_SECRET || "secret";
export const EMAIL_ADDRESS = process.env.EMAIL_ADDRESS;
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
export const prisma = new PrismaClient();

const app = express();
app.use(express.json());
app.use(cors());
app.use("/posts", postRoutes);
app.use("/users", userRoutes);

declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

const server = app.listen(PORT, () => console.log(`🚀 Server ready at: http://localhost:${PORT}`));
