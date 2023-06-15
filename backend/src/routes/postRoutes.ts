import express from "express";
import {
  getPosts,
  getPostById,
  getDrafts,
  createPost,
  updatePost,
  deletePost,
  publishPost,
  unpublishPost,
  getFilteredPosts,
} from "../controllers/postController";
import verifyToken from "../middlewares/verifyToken";

const router = express.Router();

router.get("/feed", getPosts);
router.get("/drafts", verifyToken, getDrafts);
router.get("/filterPosts", getFilteredPosts);
router.get("/:id", verifyToken, getPostById);
router.post("/", verifyToken, createPost);
router.put("/publish/:id", verifyToken, publishPost);
router.put("/unpublish/:id", verifyToken, unpublishPost);
router.put("/:id", verifyToken, updatePost);
router.delete("/:id", verifyToken, deletePost);

export default router;
