import express from "express";
import { signUpUser, signInUser, verifyEmail } from "../controllers/userController";

const router = express.Router();

router.post("/signup", signUpUser);
router.post("/signin", signInUser);
router.post("/verifyEmail", verifyEmail);
export default router;
