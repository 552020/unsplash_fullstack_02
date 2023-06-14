import { useState, useEffect } from "react";
import Router from "next/router";
import { getAuthToken } from "../utils/auth";
import { createPost, deletePost, publishPost } from "../utils/api";

export interface DraftProps {
  isLoggedIn?: boolean;
  post: Post;
}

interface Author {
  id: number;
  name: string;
  email: string;
}
interface Post {
  id: number;
  title: string;
  content: string;
  published: boolean;
  author: Author;
}

const Draft: React.FC<DraftProps> = ({
  isLoggedIn: initialIsLoggedIn = false, // this uses the initial value if `isLoggedIn` prop is undefined
  post = {
    id: null,
    title: "",
    content: "",
    published: false,
    author: {
      id: 0, // you can set these defaults according to your requirements
      name: "",
      email: "",
    },
  },
}) => {
  const {
    id: initialId,
    title: initialTitle,
    content: initialContent,
    published: initialPublished,
    author: { email: initialAuthorEmail },
  } = post;

  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [authorEmail, setAuthorEmail] = useState(initialAuthorEmail);
  const [published, setPublished] = useState(initialPublished);
  const [isLoggedIn, setIsLoggedIn] = useState(initialIsLoggedIn);

  const createPostHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const token = getAuthToken();
      const res = await createPost(title, content, authorEmail, token, true); // `published` is true
      console.log(res);
      await Router.push("/create");
    } catch (error) {
      console.error(error);
    }
  };

  const saveAsDraftHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const token = getAuthToken();
      const res = await createPost(title, content, authorEmail, token, false); // `published` is false
      console.log(res);
      await Router.push("/create");
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    const draftToDelete: DraftProps = {
      isLoggedIn,
      post: {
        id: initialId,
        title,
        content,
        published,
        author: {
          id: 0, // Update with the correct author ID if needed
          name: "", // Update with the correct author name if needed
          email: authorEmail,
        },
      },
    };

    try {
      await deletePost(draftToDelete);
      // Handle success or perform any other necessary action
      // For example, show a success message or redirect the user
    } catch (error) {
      console.error(error);
    }
  };

  const handlePublish = async () => {
    const draftToPublish: DraftProps = {
      isLoggedIn,
      post: {
        id: initialId,
        title,
        content,
        published: true, // Mark as published
        author: {
          id: 0, // Update with the correct author ID if needed
          name: "", // Update with the correct author name if needed
          email: authorEmail,
        },
      },
    };

    try {
      await publishPost(draftToPublish);
      // Handle success or perform any other necessary action
      // For example, show a success message or redirect the user
    } catch (error) {
      console.error(error);
    }
  };

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
            onClick={createPostHandler}
          >
            Publish
          </button>
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
