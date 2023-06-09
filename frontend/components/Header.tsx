import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

const Header: React.FC = () => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) => router.pathname === pathname;

  const [user, setUser] = useState({ email: "", loggedIn: false });

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const email = typeof window !== "undefined" ? localStorage.getItem("email") : "";

    if (token) {
      setUser({ email, loggedIn: true });
    }
  }, []);

  const handleSignOut = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    Cookies.remove("token");
    setUser({ email: "", loggedIn: false });
    router.push("/");
  };

  return (
    <nav className="flex items-center py-3 px-4 bg-blue-50  container mx-auto rounded">
      <div className="flex items-center space-x-4">
        <Link href="/">
          <span
            className={`bg-blue-200 p-3 hover:bg-blue-500 hover:text-white rounded ${
              isActive("/") ? "font-bold text-black" : "text-gray-500"
            }`}
          >
            Home
          </span>
        </Link>
        {user.loggedIn && (
          <Link href="/drafts">
            <span
              className={` bg-blue-200 p-3 rounded hover:bg-blue-500 hover:text-white ${
                isActive("/drafts") ? "text-black font-bold " : "text-gray-500"
              }`}
            >
              Drafts
            </span>
          </Link>
        )}
      </div>
      <div className="  ml-auto space-x-4">
        {user.loggedIn ? (
          <div>
            <div className="flex space-x-1 ">
              <button
                onClick={handleSignOut}
                className="bg-blue-200 hover:bg-blue-500 hover:text-white flex  px-3 py-2 rounded"
              >
                Sign out
              </button>
              <Link
                className={`  hover:bg-blue-500 hover:text-white p-2 rounded bg-blue-200 ${
                  isActive("/create") ? "text-gray-500" : "text-black"
                }`}
                href="/create"
              >
                <span>New Post</span>
              </Link>
            </div>

            <div className="p-1 rounded bg-slate-50  text-xs">Logged in as {user.email}</div>
          </div>
        ) : (
          <div>
            <Link href="/signup">
              <span
                className={` p-2 rounded bg-blue-200 hover:bg-blue-500 hover:text-white ${
                  isActive("/signup") ? "text-gray-500" : "text-black"
                }`}
              >
                Signup
              </span>
            </Link>

            <Link href={`/signin?redirectTo=${router.asPath}`}>
              <span
                className={`border border-black p-2 rounded bg-blue-200 hover:bg-blue-500 hover:text-white ${
                  isActive("/signup") ? "text-gray-500" : "text-black"
                }`}
              >
                Signin
              </span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
