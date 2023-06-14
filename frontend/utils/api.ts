import Router from "next/router";
import { headersWithToken, getAuthToken } from "./auth";
const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
import { DraftProps } from "../components/Draft";

export const getPostByIdAuth = async (id: string) => {
  try {
    const token = getAuthToken();
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const res = await fetch(`${NEXT_PUBLIC_API_URL}/post/${id}`, { headers: headers });
    const post = await res.json();
    return post;
  } catch (error) {
    console.log("error", error);
  }
};

export const createPost = async (title: string, content: string, authorEmail: string, published: boolean) => {
  try {
    const token = getAuthToken();
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

export async function updatePost(id, title, content, authorEmail, published) {
  try {
    const token = getAuthToken();
    const response = await fetch(`${NEXT_PUBLIC_API_URL}/post/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content, authorEmail, published }),
    });
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(`Failed to update post: ${response.statusText}`);
    }
  } catch (error) {
    console.log("error", error);
  }
}

// to delete a post we need only the post id
export const deletePost = async (postId) => {
  try {
    const res = await fetch(`${NEXT_PUBLIC_API_URL}/post/${postId}`, {
      method: "DELETE",
      headers: headersWithToken,
      body: JSON.stringify(postId),
    });
    const response = await res.json();
    return response;
  } catch (error) {
    console.log("error", error);
  }
};

export const publishPost = async (postId) => {
  try {
    const body = { published: true };
    const res = await fetch(`${NEXT_PUBLIC_API_URL}/publish/${postId}`, {
      method: "PUT",
      headers: headersWithToken,
      body: JSON.stringify(body),
    });
    const response = await res.json();
    return response;
  } catch (error) {
    console.log("error", error);
  }
};

export const unpublishPost = async (postId) => {
  try {
    const body = { published: false };
    const res = await fetch(`${NEXT_PUBLIC_API_URL}/publish/${postId}`, {
      method: "PUT",
      headers: headersWithToken,
      body: JSON.stringify(false),
    });
    const response = await res.json();
    return response;
  } catch (error) {
    console.log("error", error);
  }
};
