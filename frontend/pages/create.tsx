import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Router from "next/router";
import Link from "next/link";

const Test = () => <h1>Hello Test!</h1>;

const Draft: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authorEmail, setAuthorEmail] = useState("");

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
      console.log("timestamp: ", Date.now());
      console.log("process.env.NEXT_PUBLIC_API_URL", process.env.NEXT_PUBLIC_API_URL);
      const body = { title, content, authorEmail };
      console.log("body: ", body);
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };
      console.log("headers: ", headers);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      });
      console.log();
      console.log("res: ", res);
      await Router.push("/create");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <div>
        {isLoggedIn ? (
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
        ) : (
          <p>You must be logged in to create a draft.</p>
        )}
      </div>
    </Layout>
  );
};

export default Draft;
