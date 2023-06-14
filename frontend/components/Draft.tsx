import { useState, useEffect, use } from "react";
import Router from "next/router";
import { getAuthToken } from "../utils/auth";
import { createPost, deletePost, publishPost, unpublishPost, getPostByIdAuth, updatePost } from "../utils/api";

export interface DraftProps {
  postId: string | string[] | undefined;
}

const Draft: React.FC<DraftProps> = ({ postId }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [authorEmail, setAuthorEmail] = useState("");

  useEffect(() => {
    if (!postId) return;
    setIsLoading(true);
    const fetchPost = async () => {
      try {
        const post = await getPostByIdAuth(postId.toString());
        setTitle(post.title);
        setContent(post.content);
        setPublished(post.published);
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  if (!postId) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const createOrUpdatePostHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      let res;
      if (!postId) {
        setAuthorEmail(localStorage.getItem("email"));
        res = await createPost(title, content, authorEmail, true);
      } else {
        res = await updatePost(postId, title, content, authorEmail, true);
      }
      console.log(res);
      if (postId) {
        await Router.push(`/posts/${postId}`);
      } else {
        await Router.push("/create");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const unpublishPostHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const token = getAuthToken();
      const res = await unpublishPost(postId);
      console.log(res);
      await Router.push(`/posts/${postId}`);
    } catch (error) {
      console.error(error);
    }
  };

  const saveAsDraftHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const authorEmail = localStorage.getItem("email");
      const token = getAuthToken();
      const res = await createPost(title, content, authorEmail, token, false); // `published` is false
      console.log(res);
      await Router.push("/create");
    } catch (error) {
      console.error(error);
    }
  };

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const token = getAuthToken();
      const res = await createPost(title, content, authorEmail, token, published);
      console.log(res);
      await Router.push("/create");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <form className="max-w-md w-full space-y-8" onSubmit={submitData}>
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create Post</h2>
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
        <div className="flex gap-2">
          <button
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 items-center"
            disabled={!content || !title}
            type="button"
            onClick={createOrUpdatePostHandler}
          >
            {postId ? "Update" : "Publish"}
          </button>
          {postId && published && (
            <button
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 items-center"
              type="button"
              onClick={unpublishPostHandler}
            >
              Unpublish
            </button>
          )}
          <button
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 items-center"
            disabled={!content || !title}
            type="button"
            onClick={saveAsDraftHandler}
          >
            <div>
              <p>Save</p> <span className="italic text-xs">as Draft</span>
            </div>
          </button>
          <a
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 items-center"
            href="#"
            onClick={() => Router.push("/")}
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
};

export default Draft;
