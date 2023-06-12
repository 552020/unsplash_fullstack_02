import React from "react";
import { GetServerSideProps } from "next";
import Layout from "../components/Layout";
import Post, { PostProps } from "../components/Post";

type Props = {
  feed: PostProps[];
};

const Blog: React.FC<Props> = (props) => {
  console.log(props.feed);
  return (
    <Layout>
      <div className="page">
        <h1 className="">My Blog</h1>
        <main>
          {props.feed.map((post, index) => (
            <div
              key={post.id}
              className="bg-white transition-shadow duration-100 ease-in hover:shadow-md mt-8 first:mt-0"
            >
              <Post post={post} />
            </div>
          ))}
        </main>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/feed`);
  const feed = await res.json();
  return {
    props: { feed },
  };
};

export default Blog;
