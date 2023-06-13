import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Router from "next/router";

interface DraftProps {
  title?: string;
  content?: string;
  isLoggedIn?: boolean;
  postId?: number;
  authorEmail?: string;
  published: boolean;
}

// interface Author {
// 	id: number;
// 	name: string;
//   }

//   interface Post {
// 	id: number;
// 	title: string;
// 	content: string;
// 	published: boolean;
// 	author: Author;
//   }

//   type DraftProps = {
// 	id: number;
// 	title: string;
// 	content: string;
//   };

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// We use an anonymous function here to get the most recent value of the token from localStorage
const getAuthToken = () => {
  return localStorage.getItem("token");
};

const headersWithToken = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${getAuthToken()}`,
};

// const createPost = async (newDraft: DraftProps) => {
//  try {
//   const res = await fetch(`${NEXT_PUBLIC_API_URL}/post`, {
//     method: "POST",
//     headers: headersWithToken,
//     body: JSON.stringify(newDraft),
//   });

//   if (!response.ok) {
//     throw new Error(`HTTP error! status: ${response.status}`);
//   }
//   const result = await res.json();
//   return result
// 			} catch(error) {
// 	console.log("error", error);
// }

const createPost = async (newDraft: DraftProps) => {
  try {
    const res = await fetch(`${NEXT_PUBLIC_API_URL}/post`, {
      method: "POST",
      headers: headersWithToken,
      body: JSON.stringify(newDraft),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await res.json();
    return result;
  } catch (error) {
    console.log("error", error);
  }
};

const savePost = async (post: DraftProps) => {
	try 
  const res = await fetch(`${NEXT_PUBLIC_API_URL}/post/${post.id}`, {
    method: "PUT",
    headers: headersWithToken,
    body: JSON.stringify(post),
  });
  return res.json();
};

const deletePost = async (post: DraftProps) => {
  const res = await fetch(`${NEXT_PUBLIC_API_URL}/post/${post.id}`, {
    method: "DELETE",
    headers: headersWithToken,
    body: JSON.stringify(post),
  });
  return res.json();
};

const publishPost = async (post: DraftProps) => {
  const res = await fetch(`${NEXT_PUBLIC_API_URL}/publish/${post.id}`, {
    method: "PUT",
    headers: headersWithToken,
    body: JSON.stringify(post),
  });
  return res.json();
};

const Draft: React.FC<DraftProps> = ({
  title: initialTitle = "",
  content: initialContent = "",
  isLoggedIn: initialIsLoggedIn = false,
  authorEmail: initialAuthorEmail = "",
  postId = null,
  published: initialPublished = false,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [isLoggedIn, setIsLoggedIn] = useState(initialIsLoggedIn);
  const [authorEmail, setAuthorEmail] = useState(initialAuthorEmail);
  const [published, setPublished] = useState(initialPublished);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const email = typeof window !== "undefined" ? localStorage.getItem("email") : null;
    if (token) {
      setIsLoggedIn(true);
    }

    if (email) {
      setAuthorEmail(email);
    }
  }, []);

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const body = { title, content, authorEmail };
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      });
      await Router.push("/create");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <form className="max-w-md w-full space-y-8" onSubmit={submitData}>
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create Draft</h2>
        </div>
        <input
          className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          autoFocus
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          type="text"
          value={title}
        />
        <textarea
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
          cols={50}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          rows={8}
          value={content}
        />
        <button
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={!content || !title}
          type="submit"
        >
          Create
        </button>
        <p className="flex justify-center">or</p>
        <a
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          href="#"
          onClick={() => Router.push("/")}
        >
          Cancel
        </a>
      </form>
    </div>
  );
};

const DraftPage: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);
  return (
    <Layout>
      <div>
        {isLoggedIn ? (
          <Draft />
        ) : (
          //   <div className="flex flex-col items-center justify-center min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
          //     <form className="max-w-md w-full space-y-8" onSubmit={submitData}>
          //       <div>
          //         <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create Draft</h2>
          //       </div>
          //       <input
          //         className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          //         autoFocus
          //         onChange={(e) => setTitle(e.target.value)}
          //         placeholder="Title"
          //         type="text"
          //         value={title}
          //       />
          //       <textarea
          //         className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
          //         cols={50}
          //         onChange={(e) => setContent(e.target.value)}
          //         placeholder="Content"
          //         rows={8}
          //         value={content}
          //       />
          //       <button
          //         className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          //         disabled={!content || !title}
          //         type="submit"
          //       >
          //         Create
          //       </button>
          //       <p className="flex justify-center">or</p>
          //       <a
          //         className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          //         href="#"
          //         onClick={() => Router.push("/")}
          //       >
          //         Cancel
          //       </a>
          //     </form>
          //   </div>
          <p>You must be logged in to create a draft.</p>
        )}
      </div>
    </Layout>
  );
};

export default DraftPage;
