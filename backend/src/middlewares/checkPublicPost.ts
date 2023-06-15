import { Request, Response, NextFunction } from "express";
import { prisma } from "../index";
import { getPostById } from "../controllers/postController";

async function checkPublicPost(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }
    if (!post.published) {
      next();
    } else {
      // Skip to the final route handler (getPostById) without going through the verifyToken middleware
      return getPostById(req, res);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to check post status." });
  }
}

export default checkPublicPost;
