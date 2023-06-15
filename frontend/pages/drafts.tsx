import Layout from "../components/Layout";
import Post, { PostProps } from "../components/Post";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getAuthToken, getAuthEmail } from "../utils/auth";

type DraftsProps = {
  drafts: PostProps[];
};

const Drafts: React.FC<DraftsProps> = () => {
  const [drafts, setDrafts] = useState<PostProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    console.log("token", token);
    const email = getAuthEmail();
    console.log("mail", email);
    const body = JSON.stringify({ email: email });
    console.log("body", body);
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      console.log("hello fetchData");

      const fetchData = async () => {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/posts/drafts?email=${encodeURIComponent(email)}`;
        // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/drafts`, {
        const res = await fetch(url, {
          headers: { body, Authorization: `Bearer ${token}` },
        });
        console.log("body", body);
        console.log(body);
        console.log("res", res);
        console.log(res);

        try {
          const data = await res.json();
          setDrafts(data);
          setLoading(false);
        } catch (error) {
          console.error(error);
        }
      };

      fetchData();
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (drafts.length === 0) {
    return (
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
  }

  return (
    <Layout>
      <div className="m-4">
        <h1 className="text-3xl font-semibold mb-4">Drafts</h1>
        {drafts.map((post) => (
          <div key={post.id} className="post mb-8 p-4 border border-gray-300 rounded shadow-lg">
            <Post post={post} />
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Drafts;
