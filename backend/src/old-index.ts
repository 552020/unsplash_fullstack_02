import { PrismaClient } from "@prisma/client";
import cors from "cors";
import express from "express";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || "secret";
const EMAIL_ADDRESS = process.env.EMAIL_ADDRESS;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

const transporter = nodemailer.createTransport({
  host: "posteo.de", // Posteo SMTP server
  port: 587,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: EMAIL_ADDRESS,
    pass: EMAIL_PASSWORD,
  },
});

declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cors());

app.get("/feed", async (req, res) => {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { author: true },
  });
  res.json(posts);
});

app.get("/filterPosts", async (req, res) => {
  const { searchString }: { searchString?: string } = req.query;
  const filteredPosts = await prisma.post.findMany({
    where: {
      OR: [
        {
          title: {
            contains: searchString,
          },
        },
        {
          content: {
            contains: searchString,
          },
        },
      ],
    },
  });
  res.json(filteredPosts);
});

app.get(`/post/:id`, async (req, res) => {
  const { id } = req.params;
  const post = await prisma.post.findUnique({
    where: {
      id: Number(id),
    },
    include: { author: true },
  });
  res.json(post);
});

app.get("/drafts", verifyToken, async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: { published: false, authorId: req.userId },
      include: { author: true },
    });
    res.json(posts);
  } catch (error) {
    console.log((error as Error).message);
    res.status(500).json({ error: (error as Error).message });
  }
});

app.post(`/post`, verifyToken, async (req: Request, res: Response) => {
  try {
    const { title, content, published = false } = req.body;
    console.log(req.body);
    console.log(req.userId);
    const result = await prisma.post.create({
      data: {
        title,
        content,
        published,

        author: { connect: { id: req.userId } },
      },
    });
    res.json(result);
    console.log("result of /post");
    console.log(result);
  } catch (error) {
    console.log((error as Error).message);
    res.status(500).json({ error: (error as Error).message });
  }
});

app.delete(`/post/:id`, verifyToken, async (req, res) => {
  const { id } = req.params;

  const post = await prisma.post.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!post) {
    return res.status(404).json({ error: "Post not found." });
  }

  if (post.authorId !== req.userId) {
    return res.status(403).json({ error: "You are not authorized to delete this post." });
  }

  const deletedPost = await prisma.post.delete({
    where: {
      id: Number(id),
    },
  });

  res.json(deletedPost);
});

app.put("/publish/:id", verifyToken, async (req, res) => {
  const { id } = req.params;

  const post = await prisma.post.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!post) {
    return res.status(404).json({ error: "Post not found." });
  }

  if (post.authorId !== req.userId) {
    return res.status(403).json({ error: "You are not authorized to publish this post." });
  }

  const updatedPost = await prisma.post.update({
    where: { id: Number(id) },
    data: { published: true },
  });

  res.json(updatedPost);
});

app.put("/unpublish/:id", verifyToken, async (req, res) => {
  const { id } = req.params;

  const post = await prisma.post.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!post) {
    return res.status(404).json({ error: "Post not found." });
  }

  if (post.authorId !== req.userId) {
    return res.status(403).json({ error: "You are not authorized to publish this post." });
  }

  const updatedPost = await prisma.post.update({
    where: { id: Number(id) },
    data: { published: false },
  });

  res.json(updatedPost);
});

app.post(`/user`, async (req, res) => {
  const result = await prisma.user.create({
    data: {
      ...req.body,
    },
  });
  res.json(result);
});

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      verifiedEmail: false, // default value
    },
  });

  const token = jwt.sign({ id: user.id }, JWT_SECRET);

  // Send verification email after successful registration
  const verificationLink = `${process.env.NEXT_PUBLIC_API_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: EMAIL_ADDRESS, // sender address
    to: email, // list of receivers
    subject: "Email Verification", // Subject line
    text: `Hello, please use the following link to verify your email address: ${verificationLink}`, // plain text body
    html: `<b>Hello,</b><br>please use the following link to verify your email address: <a href="${verificationLink}">${verificationLink}</a>`, // html body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(`Email sending error: ${error}`);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });

  //   res.json({ token });
  res.json({ token, email: user.email });
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(400).json({ error: "No user found with this email." });
  }

  const passwordIsValid = bcrypt.compareSync(password, user.password);

  if (!passwordIsValid) {
    return res.status(400).json({ error: "Invalid password." });
  }

  // Bypass email verification for testing purposes - TODO: remove later
  //   if (!user.verifiedEmail) {
  //     return res.status(400).json({ error: "Email is not verified. Please check your email for the verification link." });
  //   }
  const token = jwt.sign({ id: user.id }, JWT_SECRET);

  //   res.json({ token });
  res.json({ token, email: user.email });
});

app.get("/verify-email", async (req, res) => {
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
});

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

const server = app.listen(PORT, () => console.log(`🚀 Server ready at: http://localhost:${PORT}`));

//
// Type assertion is being used in this case to assert that the decoded object has a certain shape, specifically that it has an id property which is a number. This is because JWT decoding in JavaScript is a bit loose and does not provide strict typing. It's not 100% safe because we're basically telling TypeScript "trust me, I know what I'm doing". If the decoded token does not actually have an id property that is a number, it could lead to unexpected behavior. To mitigate this risk, you could add a runtime check to ensure that decoded.id is indeed a number before assigning it to req.userId.

// Note regarding bcrypt.hashSync:
// The use of the bcrypt library for password hashing is generally recommended. However, consider using an async version of bcrypt.hash instead of bcrypt.hashSync to avoid blocking the event loop. For example, you can use bcrypt.hash with await or wrap it in a Promise to make it asynchronous.

// In the verifyToken function, consider adding a runtime check to ensure that decoded.id is indeed a number before assigning it to req.userId. This can help prevent unexpected behavior if the decoded token doesn't have the expected structure.
