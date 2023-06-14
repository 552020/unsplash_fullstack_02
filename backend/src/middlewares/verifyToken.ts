import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "secret";

function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(" ")[1];
  console.log("token");
  console.log(token);

  if (!token) {
    console.log("No token provided.");
    return res.status(403).json({ error: "No token provided." });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("Failed to authenticate token.");
      return res.status(500).json({ error: "Failed to authenticate token." });
    }
    // see note below about this type assertion
    // TODO add a runtime check to ensure that decoded.id is indeed a number before assigning it to req.userId
    const payload = decoded as { id: number };
    console.log("payload");
    console.log(payload);
    req.userId = payload.id;
    next();
  });
}

export default verifyToken;
