// import React, { useState } from 'react'
// import Router from 'next/router'
// import Layout from '../components/Layout'

// const SignUp: React.FC = () => {
//   const [name, setName] = useState('')
//   const [email, setEmail] = useState('')

//   const submitData = async (e: React.SyntheticEvent) => {
//     e.preventDefault()
//     try {
//       const body = { name, email }
//       await fetch(`http://localhost:3001/user`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(body),
//       })
//       await Router.push('/')
//     } catch (error) {
//       console.error(error)
//     }
//   }

//   return (
//     <Layout>
//       <div className="page">
//         <form
//           onSubmit={submitData}>
//           <h1>Signup user</h1>
//           <input
//             autoFocus
//             onChange={e => setName(e.target.value)}
//             placeholder="Name"
//             type="text"
//             value={name}
//           />
//           <input
//             onChange={e => setEmail(e.target.value)}
//             placeholder="Email address"
//             type="text"
//             value={email}
//           />
//           <input
//             disabled={!name || !email}
//             type="submit"
//             value="Signup"
//           />
//           <a className="back" href="#" onClick={() => Router.push('/')}>
//             or Cancel
//         </a>
//         </form>
//       </div>
//       <style jsx>{`
//       .page {
//         background: white;
//         padding: 3rem;
//         display: flex;
//         justify-content: center;
//       }

//       input[type='text'] {
//         width: 100%;
//         padding: 0.5rem;
//         margin: 0.5rem 0;
//         border-radius: 0.25rem;
//         border: 0.125rem solid rgba(0, 0, 0, 0.2);
//       }

//       input[type='submit'] {
//         background: #ececec;
//         border: 0;
//         padding: 1rem 2rem;
//       }

//       .back {
//         margin-left: 1rem;
//       }
//     `}</style>
//     </Layout>
//   )
// }

// export default SignUp

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
