import React, { useState } from "react";
import Router from "next/router";
import Layout from "../components/Layout";

const SignUp: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const body = { name, email };
      await fetch(`http://localhost:3001/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await Router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <div className="flex justify-center bg-white p-12">
        <form onSubmit={submitData} className="flex flex-col">
          <h1 className="text-3xl mb-6 text-center">Signup user</h1>
          <input
            autoFocus
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            type="text"
            value={name}
            className="border rounded py-2 px-3 text-grey-darker mb-3"
          />
          <input
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            type="text"
            value={email}
            className="border rounded py-2 px-3 text-grey-darker mb-3"
          />
          <input
            disabled={!name || !email}
            type="submit"
            value="Signup"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-3 cursor-pointer"
          />
          <a className="text-blue-500 hover:underline cursor-pointer" onClick={() => Router.push("/")}>
            or Cancel
          </a>
        </form>
      </div>
    </Layout>
  );
};

export default SignUp;
