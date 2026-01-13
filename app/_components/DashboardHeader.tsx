'use client";';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineBars } from "react-icons/ai";
import Menues from "./Menues";

type User = {
  username: string;
  // email: String;
  // id: Number;
  // password: String
  // contactNumber: String
};

function DashboardHeader() {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const curentUser: User = JSON.parse(
      localStorage.getItem("currentuser")
    ) as User;
    if (!curentUser) return;
    const userString = curentUser;
    setUser(userString);
  }, []);

  const router = useRouter();
  const [displayMenues, setDisplayMenues] = useState(false);

  return (
    <>
      <nav className="flex justify-between items-center px-8 md:px-16 py-4 bg-slate-950 bg-opacity-80 backdrop-blur-md z-50 border-b border-slate-700">
        <Link href="/landing-page">
          <h1 className="text-2xl font-bold text-white">TaskFlow</h1>
        </Link>

        <p className="text-slate-400 hidden md:block">
          {user?.username}&apos;s Workspace
        </p>

        <button
          className="bg-slate-400 hidden md:block hover:bg-slate-500 text-slate-950 px-4 py-2 rounded-lg font-semibold transition"
          onClick={() => {
            localStorage.removeItem("currentuser");
            router.replace("/landing-page");
            toast.success("Logged out successfully");
          }}
        >
          Logout
        </button>

        <AiOutlineBars
          size={25}
          onClick={() => setDisplayMenues(true)}
          className="md:hidden block"
        />
      </nav>

      {displayMenues && <Menues onClose={() => setDisplayMenues(false)} />}
    </>
  );
}

export default DashboardHeader;
