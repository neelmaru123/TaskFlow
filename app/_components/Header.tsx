"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type User = {
  id: number;
  username?: string;
};

function Header() {
 const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
  if (typeof window === "undefined") return;

  const storedUser = localStorage.getItem("currentuser");
  if (!storedUser) {
    setUser(null);
    return;
  }

  try {
    const parsedUser: User = JSON.parse(storedUser) as User;
    setUser(parsedUser);
  } catch {
    setUser(null);
  }
}, []);

  return (
    <nav className="flex justify-between items-center px-8 md:px-16 py-6 bg-slate-950 bg-opacity-80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-700">
      <h1 className="text-2xl font-bold text-white">TaskFlow</h1>
      <div className="flex items-center gap-6">
        {user === null ? (
          <>
            <Link
              href="/login"
              className="text-slate-400 hover:text-white transition"
            >
              Login
            </Link>
            <Link
              href="/signUp"
              className="bg-slate-400 hover:bg-slate-500 text-slate-950 px-4 py-2 rounded-lg font-semibold transition"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <button
            className="bg-slate-400 hover:bg-slate-500 text-slate-950 px-4 py-2 rounded-lg font-semibold transition"
            onClick={() => {
              localStorage.removeItem("currentuser");
              setUser(null);
              toast.success("Logged out successfully");
            }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Header;
