import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { EMAIL_ADDRESS, EMAIL_PASSWORD, JWT_SECRET, prisma } from "../index";
import nodemailer from "nodemailer";

export async function signUpUser(req: Request, res: Response) {
  const { name, email, password } = req.body;
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        verifiedEmail: false,
      },
    });
    const token = jwt.sign({ id: user.id }, JWT_SECRET);
    // Set the JWT as a cookie
    res.cookie("jwt", token, { httpOnly: true, secure: true });
    const verificationLink = `${process.env.NEXT_PUBLIC_API_URL}/verify-email?token=${token}`;
    const mailOptions = {
      from: EMAIL_ADDRESS,
      to: email,
      subject: "Email Verification",
      text: `Hello, please use the following link to verify your email address: ${verificationLink}`,
      html: `<b>Hello,</b><br>please use the following link to verify your email address: <a href="${verificationLink}">${verificationLink}</a>`, // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(`Email sending error: ${error}`);
      } else {
        console.log(`Email sent: ${info.response}`);
      }
    });

    res.json({ token, email: user.email });
  } catch (error) {
    res.status(400).json({ error: "Error signing up user." });
  }
}

export async function signInUser(req: Request, res: Response) {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(400).json({ error: "No user found with this email." });
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      return res.status(400).json({ error: "Invalid password." });
    }
    // Bypass email verification for testing purposes - TODO: remove later
    //   if (!user.verifiedEmail) {
    //     return res.status(400).json({ error: "Email is not verified. Please check your email for the verification link." });
    //   }
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "3h" });

    // Set the JWT as a cookie
    res.cookie("jwt", token, { httpOnly: true, secure: true });

    res.json({ token, email: user.email });
  } catch (error) {
    res.status(400).json({ error: "Error signing in user." });
  }
}

const transporter = nodemailer.createTransport({
  host: "posteo.de",
  port: 587,
  secure: false, // TODO: upgrade later with STARTTLS
  auth: {
    user: EMAIL_ADDRESS,
    pass: EMAIL_PASSWORD,
  },
});

export async function verifyEmail(req: Request, res: Response) {
  const { token } = req.query;

  if (!token) {
    return res.status(403).json({ error: "No token provided." });
  }

  jwt.verify(String(token), JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(500).json({ error: "Failed to authenticate token." });
    }
    const payload = decoded as { id: number };

    const user = await prisma.user.update({
      where: { id: payload.id },
      data: { verifiedEmail: true },
    });

    res.json({ message: "Email has been successfully verified!" });
  });
}
