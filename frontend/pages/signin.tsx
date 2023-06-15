import React, { useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

const SignInPage: React.FC = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const { token } = data;
        Cookies.set("token", token);

        // TODO Store the token in local storage or cookies for future requests
        localStorage.setItem("token", token);
        localStorage.setItem("email", email);

        const { redirectTo } = router.query;

        const path = typeof redirectTo === "string" ? redirectTo : "/";

        router.push(path);
      } else {
        const errorData = await response.json();
        const { error } = errorData;

        setError(error);
      }
    } catch (error) {
      console.error("An error occurred during sign in:", error);
      setError("An error occurred during sign in. Please try again later.");
    }
  };

  return (
    <div>
      <h1>Sign In</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleSignIn}>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default SignInPage;
