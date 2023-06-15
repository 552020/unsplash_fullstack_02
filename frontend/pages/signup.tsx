import React, { useState } from "react";
import Router from "next/router";
import Layout from "../components/Layout";
import { z } from "zod";

const SignupSchema = z.object({
  name: z.string().nonempty({ message: "Name is required" }),
  email: z.string().email({ message: "Email must be valid" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
});

const SignUp: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({ name: "", email: "", password: "" });

  // TODO: save token in cookie. Please note that localStorage is not secure, and tokens can be stolen if your website has an XSS vulnerability. Cookies with httpOnly and sameSite flags are a more secure way to store tokens.
  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const body = { name, email, password };
      const result = SignupSchema.safeParse(body);
      //   if (!result.success) {
      // Here, 'error' in result is a type guard. This checks if the error property exists on result, and within that block of code, TypeScript will treat result as a SafeParseError, thus avoiding the type error.
      // The line above was throwing an error because result.error was not a SafeParseError, but a ZodError. ZodError is a superset of SafeParseError, so the type guard was failing.
      if ("error" in result) {
        setError({
          name: result.error.errors.find((err) => err.path[0] === "name")?.message || "",
          email: result.error.errors.find((err) => err.path[0] === "email")?.message || "",
          password: result.error.errors.find((err) => err.path[0] === "password")?.message || "",
        });
        return;
      } else {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
          const { token } = await res.json();
          localStorage.setItem("token", token);
          localStorage.setItem("email", email);
          await Router.push("/");
        } catch (error) {
          console.error(error);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  //     <Layout>
  //       <div className="flex justify-center bg-white p-12">
  //         <form onSubmit={submitData} className="flex flex-col">
  //           <h1 className="text-3xl mb-6 text-center">Signup user</h1>
  //           <input
  //             autoFocus
  //             onChange={(e) => setName(e.target.value)}
  //             placeholder="Name"
  //             type="text"
  //             value={name}
  //             className="border rounded py-2 px-3 text-grey-darker mb-3"
  //           />
  //           <input
  //             onChange={(e) => setEmail(e.target.value)}
  //             placeholder="Email address"
  //             type="text"
  //             value={email}
  //             className="border rounded py-2 px-3 text-grey-darker mb-3"
  //           />
  //           <input
  //             onChange={(e) => setPassword(e.target.value)}
  //             placeholder="Password"
  //             type="password"
  //             value={password}
  //             className="border rounded py-2 px-3 text-grey-darker mb-3"
  //           />
  //           <input
  //             disabled={!name || !email || !password}
  //             type="submit"
  //             value="Signup"
  //             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-3 cursor-pointer"
  //           />
  //           <p className="flex items-center justify-center mb-3">or</p>
  //           <a
  //             className="flex justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-3 cursor-pointer"
  //             onClick={() => Router.push("/")}
  //           >
  //             Cancel
  //           </a>
  //         </form>
  //       </div>
  //     </Layout>
  //   );
  // };

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
            className={`border rounded py-2 px-3 text-grey-darker mb-3 ${error.name ? "border-red-500" : ""}`}
          />
          {error.name && <p className="text-red-500">{error.name}</p>}
          <input
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            type="text"
            value={email}
            className={`border rounded py-2 px-3 text-grey-darker mb-3 ${error.email ? "border-red-500" : ""}`}
          />
          {error.email && <p className="text-red-500">{error.email}</p>}
          <input
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            value={password}
            className={`border rounded py-2 px-3 text-grey-darker mb-3 ${error.password ? "border-red-500" : ""}`}
          />
          {error.password && <p className="text-red-500">{error.password}</p>}
          <input
            type="submit"
            value="Signup"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-3 cursor-pointer"
          />
          <p className="flex items-center justify-center mb-3">or</p>
          <a
            className="flex justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-3 cursor-pointer"
            onClick={() => Router.push("/signin")}
          >
            Sign In
          </a>
        </form>
      </div>
    </Layout>
  );
};

export default SignUp;
