import Router from "next/router";
import { headersWithToken, getAuthToken } from "./auth";
const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
import { DraftProps } from "../components/Draft";

export const createPost = async (
  title: string,
  content: string,
  authorEmail: string,
  token: string,
  published: boolean
) => {
  try {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const body = { title, content, authorEmail, published };
    const res = await fetch(`${NEXT_PUBLIC_API_URL}/post`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const result = await res.json();
    const postId = result.id; // Get the post's id from the response
    console.log("postId", postId);

    // Redirect the user to the post page
    // Replace "/posts/:id" with the actual route for displaying a post by its
    Router.push(`/posts/${postId}`);
  } catch (error) {
    console.log("error", error);
  }
};

export const updatePost = async (post: DraftProps) => {
  try {
    const res = await fetch(`${NEXT_PUBLIC_API_URL}/post/${post.post.id}`, {
      method: "PUT",
      headers: headersWithToken,
      body: JSON.stringify(post),
    });
    const response = await res.json();
    return response;
  } catch (error) {
    console.log("error", error);
  }
};

export const deletePost = async (post: DraftProps) => {
  try {
    const res = await fetch(`${NEXT_PUBLIC_API_URL}/post/${post.post.id}`, {
      method: "DELETE",
      headers: headersWithToken,
      body: JSON.stringify(post),
    });
    const response = await res.json();
    return response;
  } catch (error) {
    console.log("error", error);
  }
};

export const publishPost = async (post: DraftProps) => {
  try {
    const res = await fetch(`${NEXT_PUBLIC_API_URL}/publish/${post.post.id}`, {
      method: "PUT",
      headers: headersWithToken,
      body: JSON.stringify(post),
    });
    const response = await res.json();
    return response;
  } catch (error) {
    console.log("error", error);
  }
};
