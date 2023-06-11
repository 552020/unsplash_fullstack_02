import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const Header: React.FC = () => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) => router.pathname === pathname;

  const user = {
    email: "example@example.com",
    loggedIn: true,
  };

  //     <nav>
  //       <div className="left">
  //         <Link href="/" className="bold" data-active={isActive("/")}>
  //           Blog
  //         </Link>
  //         <Link href="/drafts" data-active={isActive("/drafts")}>
  //           Drafts
  //         </Link>
  //       </div>
  //       <div className="right">
  //         <Link href="/signup" data-active={isActive("/signup")}>
  //           Signup
  //         </Link>
  //         <Link href="/create" data-active={isActive("/create")}>
  //           + Create draft
  //         </Link>
  //       </div>
  //       <style jsx>{`
  //         nav {
  //           display: flex;
  //           padding: 2rem;
  //           align-items: center;
  //         }

  //         .bold {
  //           font-weight: bold;
  //         }

  //         a {
  //           text-decoration: none;
  //           color: #000;
  //           display: inline-block;
  //         }

  //         .left a[data-active="true"] {
  //           color: gray;
  //         }

  //         a + a {
  //           margin-left: 1rem;
  //         }

  //         .right {
  //           margin-left: auto;
  //         }

  //         .right a {
  //           border: 1px solid black;
  //           padding: 0.5rem 1rem;
  //           border-radius: 3px;
  //         }
  //       `}</style>
  //     </nav>
  //   );
  // };

  // export default Header;

  //   return (
  //     <nav className="flex items-center py-8 px-4">
  //       <div className="flex items-center space-x-6">
  //         <Link href="/" passHref className={`font-bold ${isActive("/") ? "text-gray-500" : "text-black"}`}>
  //           Blog
  //         </Link>
  //         <Link href="/drafts" passHref className={isActive("/drafts") ? "text-gray-500" : "text-black"}>
  //           Drafts
  //         </Link>
  //       </div>
  //       <div className="ml-auto space-x-4">
  //         {user.loggedIn ? (
  //           <>
  //             <div className="text-gray-500">Logged in as {user.email}</div>
  //             <button className="border border-black px-4 py-2 rounded">Sign out</button>
  //           </>
  //         ) : (
  //           <>
  //             <Link href="/signup" passHref className={isActive("/signup") ? "text-gray-500" : "text-black"}>
  //               Signup
  //             </Link>
  //             <Link href="/create" passHref className={isActive("/create") ? "text-gray-500" : "text-black"}>
  //               + Create draft
  //             </Link>
  //             <Link href="/signin" passHref className={isActive("/signin") ? "text-gray-500" : "text-black"}>
  //               Signin
  //             </Link>
  //           </>
  //         )}
  //       </div>
  //     </nav>
  //   );
  // };

  // export default Header;

  return (
    <nav className="flex items-center py-8 px-4">
      <div className="flex items-center space-x-6">
        <Link href="/" passHref>
          <span className={`font-bold ${isActive("/") ? "text-gray-500" : "text-black"}`}>Blog</span>
        </Link>
        <Link href="/drafts" passHref>
          <span className={isActive("/drafts") ? "text-gray-500" : "text-black"}>Drafts</span>
        </Link>
      </div>
      <div className="ml-auto space-x-4">
        {user.loggedIn ? (
          <>
            <div className="text-gray-500">Logged in as {user.email}</div>
            <button className="border border-black px-4 py-2 rounded">Sign out</button>
          </>
        ) : (
          <>
            <Link href="/signup" passHref>
              <span className={isActive("/signup") ? "text-gray-500" : "text-black"}>Signup</span>
            </Link>
            <Link href="/create" passHref>
              <span className={isActive("/create") ? "text-gray-500" : "text-black"}>+ Create draft</span>
            </Link>
            <Link href="/signin" passHref>
              <span className={isActive("/signin") ? "text-gray-500" : "text-black"}>Signin</span>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;
