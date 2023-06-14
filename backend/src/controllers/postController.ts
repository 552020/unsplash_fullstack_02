import { Request, Response } from "express";

import { prisma } from "../index";

export async function getPosts(req: Request, res: Response) {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      include: { author: true },
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}

export async function getPostById(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: Number(id),
      },
      include: { author: true },
    });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
export async function getDrafts(req: Request, res: Response) {
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
}
export async function getFilteredPosts(req: Request, res: Response) {
  const { searchString } = req.query;
  if (typeof searchString !== "string") {
    res.status(400).json({ error: "Invalid searchString parameter" });
    return;
  }
  try {
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
  } catch (error) {
    console.log((error as Error).message);
    res.status(500).json({ error: (error as Error).message });
  }
}
export async function createPost(req: Request, res: Response) {
  const { title, content, published = false } = req.body;
  try {
    const result = await prisma.post.create({
      data: {
        title,
        content,
        published,

        author: { connect: { id: req.userId } },
      },
    });
    res.json(result);
  } catch (error) {
    console.log((error as Error).message);
    res.status(500).json({ error: (error as Error).message });
  }
}

export async function publishPost(req: Request, res: Response) {
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
}

export async function unpublishPost(req: Request, res: Response) {
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
}

export async function updatePost(req: Request, res: Response) {
  const { id } = req.params;
  const { title, content, published } = req.body;

  const post = await prisma.post.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!post) {
    return res.status(404).json({ error: "Post not found." });
  }

  if (post.authorId !== req.userId) {
    return res.status(403).json({ error: "You are not authorized to update this post." });
  }

  const updatedPost = await prisma.post.update({
    where: { id: Number(id) },
    data: { title, content, published },
  });

  res.json(updatedPost);
}

export async function deletePost(req: Request, res: Response) {
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

    if (post.authorId !== req.userId) {
      return res.status(403).json({ error: "You are not authorized to delete this post." });
    }

    const deletedPost = await prisma.post.delete({
      where: {
        id: Number(id),
      },
    });

    res.json(deletedPost);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}

//...other functions
