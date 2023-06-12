import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

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
    setUser({ email: "", loggedIn: false });
    router.push("/");
  };

  return (
    <nav className="flex items-center py-8 px-4">
      <div className="flex items-center space-x-6">
        <Link href="/">
          <span className={`font-bold ${isActive("/") ? "text-gray-500" : "text-black"}`}>Blog</span>
        </Link>
        <Link href="/drafts">
          <span className={isActive("/drafts") ? "text-gray-500" : "text-black"}>Drafts</span>
        </Link>
      </div>
      <div className="ml-auto space-x-4">
        {user.loggedIn ? (
          <>
            <div className="text-gray-500">Logged in as {user.email}</div>
            <button onClick={handleSignOut} className="border border-black px-4 py-2 rounded">
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link href="/signup">
              <span className={isActive("/signup") ? "text-gray-500" : "text-black"}>Signup</span>
            </Link>
            <Link href="/create">
              <span className={isActive("/create") ? "text-gray-500" : "text-black"}>+ Create draft</span>
            </Link>
            <Link href={`/signin?redirectTo=${router.asPath}`}>
              <span className={isActive("/signin") ? "text-gray-500" : "text-black"}>Signin</span>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;
