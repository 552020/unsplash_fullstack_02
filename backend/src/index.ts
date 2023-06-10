import { PrismaClient } from "@prisma/client";
import cors from "cors";
import express from "express";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cors());

app.get("/drafts", async (req, res) => {
  const posts = await prisma.post.findMany({
    where: { published: false },
    include: { author: true },
  });
  res.json(posts);
});

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

app.post(`/post`, async (req, res) => {
  const { title, content, authorEmail } = req.body;
  const result = await prisma.post.create({
    data: {
      title,
      content,
      published: false,
      author: { connect: { email: authorEmail } },
    },
  });
  res.json(result);
});

app.delete(`/post/:id`, async (req, res) => {
  const { id } = req.params;
  const post = await prisma.post.delete({
    where: {
      id: Number(id),
    },
  });
  res.json(post);
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

app.put("/publish/:id", async (req, res) => {
  const { id } = req.params;
  const post = await prisma.post.update({
    where: { id: Number(id) },
    data: { published: true },
  });
  res.json(post);
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
    },
  });

  const token = jwt.sign({ id: user.id }, "your-secret-key");

  res.json({ token });
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

  const token = jwt.sign({ id: user.id }, "your-secret-key");

  res.json({ token });
});

declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(403).json({ error: "No token provided." });
  }

  jwt.verify(token, "your-secret-key", (err, decoded) => {
    if (err) {
      return res.status(500).json({ error: "Failed to authenticate token." });
    }
    // see note below about this type assertion
    // TODO add a runtime check to ensure that decoded.id is indeed a number before assigning it to req.userId
    const payload = decoded as { id: number };
    req.userId = payload.id;
    next();
  });
}

const server = app.listen(3001, () => console.log("🚀 Server ready at: http://localhost:3001"));

//
// Type assertion is being used in this case to assert that the decoded object has a certain shape, specifically that it has an id property which is a number. This is because JWT decoding in JavaScript is a bit loose and does not provide strict typing. It's not 100% safe because we're basically telling TypeScript "trust me, I know what I'm doing". If the decoded token does not actually have an id property that is a number, it could lead to unexpected behavior. To mitigate this risk, you could add a runtime check to ensure that decoded.id is indeed a number before assigning it to req.userId.
