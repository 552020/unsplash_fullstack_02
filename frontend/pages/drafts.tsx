import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Post, { PostProps } from "../components/Post";
import Link from "next/link";
export const getServerSideProps = null;
export const config = { unstable_runtimeJS: false };

type DraftsProps = {
  drafts: PostProps[];
};

const Drafts: React.FC<DraftsProps> = (props) => {
  const [drafts, setDrafts] = useState<PostProps[]>([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // add a loading state

  useEffect(() => {
    // It would be better to ssolve this server side with cookies. We had to add a loading state to prevent hydration errors.
    const token = localStorage.getItem("token");
    setLoggedIn(!!token);

    if (token) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/drafts`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (!Array.isArray(data)) {
            console.error("API returned non-array response:", data);
            return;
          }
          setDrafts(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>; // render a loading message while loading
  }

  let content;

  if (!loggedIn) {
    content = <p>Please log in to see your drafts.</p>;
  } else if (drafts.length === 0) {
    content = (
      <div>
        <p>There are no drafts.</p>
        <Link
          href="/create"
          className="inline-block mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Create a new one
        </Link>
      </div>
    );
  } else {
    content = drafts.map((post) => (
      <div key={post.id} className="post mb-8 p-4 border border-gray-300 rounded shadow-lg">
        <Post post={post} />
      </div>
    ));
  }

  return (
    <Layout>
      <div className="m-4">
        <h1 className="text-3xl font-semibold mb-4">Drafts</h1>
        {content}
      </div>
    </Layout>
  );
};

export default Drafts;
