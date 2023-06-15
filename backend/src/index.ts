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

// Middleware function to log incoming requests
app.use((req, res, next) => {
  console.log(
    `Incoming request: \nmethod: ${req.method}, \nurl: ${req.url}, \nbody: ${JSON.stringify(req.body)},  \nheaders:
     ${JSON.stringify(req.headers)})}`
  );
  next(); // Call next() to pass the request to the next middleware or route handler
});

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
