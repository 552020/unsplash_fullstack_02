import Router from "next/router";
import ReactMarkdown from "react-markdown";

export type PostProps = {
  id: number;
  title: string;
  author: {
    name: string;
    email?: string;
  };
  content: string;
  published: boolean;
};

const Post: React.FC<{ post: PostProps }> = ({ post }) => {
  const authorName = post.author ? post.author.name : "Unknown author";
  return (
    <div
      onClick={() => Router.push("/p/[id]", `/p/${post.id}`)}
      className="p-4 my-2 bg-white rounded shadow cursor-pointer "
    >
      <h2 className="  text-2xl text-gray-700 bg-yellow-300 p-1 rounded-xl px-3">{post.title}</h2>
      <p className="text-sm text-gray-500">By {authorName}</p>
      <ReactMarkdown className="prose mt-4">{post.content}</ReactMarkdown>
    </div>
  );
};

export default Post;
