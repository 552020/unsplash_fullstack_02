import { GetServerSideProps } from "next";
import ReactMarkdown from "react-markdown";
import Layout from "../../components/Layout";
import Router from "next/router";
import { PostProps } from "../../components/Post";
import nextCookie from "next-cookies";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
async function publish(id: number): Promise<void> {
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/publish/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });
  await Router.push("/${id}");
}

async function destroy(id: number): Promise<void> {
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/publish/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });
  await Router.push("/");
}

const Post: React.FC<PostProps> = (props) => {
  console.log(props);
  let title = props.title;
  if (!props.published) {
    title = `${title} (Draft)`;
  }

  const loggedInUser = typeof window !== "undefined" ? localStorage.getItem("email") : null;
  const canEdit = loggedInUser && loggedInUser === props?.author?.email;

  return (
    <Layout>
      <div className="border-2 border-gray-600 rounded-lg p-4">
        <h2 className="text-2xl mb-2">{title}</h2>
        <p>
          By <span className="italic"> {props?.author?.name || "Unknown author"}</span>
        </p>
        <ReactMarkdown children={props.content} className="border-2 border-gray-600 rounded p-4 my-4 bg-white" />
        {!props.published && (
          <button
            onClick={() => publish(props.id)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Publish
          </button>
        )}
        {canEdit && (
          <button
            onClick={() => destroy(props.id)}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-4"
          >
            Delete
          </button>
        )}
        {canEdit && (
          <button
            onClick={() => Router.push(`/edit/${props.id}`)}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-4"
          >
            Edit
          </button>
        )}
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { token } = nextCookie(context);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${context.params.id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  // When status is 404, redirect to a 404 page
  if (res.status === 404) {
    return {
      notFound: true,
    };
  }

  // When status is 401 or 403, redirect to login page
  if (res.status === 401 || res.status === 403) {
    return {
      redirect: {
        destination: "/signup",
        permanent: false,
      },
    };
  }

  // When status is 500, show an error page
  if (res.status === 500) {
    return {
      redirect: {
        destination: "/500",
        permanent: false,
      },
    };
  }

  const data = await res.json();

  return { props: { ...data } };
};

export default Post;
