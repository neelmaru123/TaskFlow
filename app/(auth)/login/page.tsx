"use client";

import bcrypt from "bcryptjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";

type ErrorState = {
  email: string;
  password: string;
  error: string;
};

type User = {
  id: number;
  email: string;
  password: string;
  name?: string;
};

export default function Page() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<ErrorState>({
    email: "",
    password: "",
    error: "",
  });
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedUser = localStorage.getItem("currentuser");
    const user: User | null = storedUser === undefined
      ? (JSON.parse(storedUser) as User)
      : null;

    if (user) router.replace("/");
  }, [router]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const fd = new FormData(e.currentTarget);
    const formData = Object.fromEntries(fd.entries()) as Record<string, string>;

    const newError = { email: "", password: "", error: "" };

    if (!formData.email.trim()) {
      newError.email = "Email is required";
    }

    if (!formData.password) {
      newError.password = "Password is required";
    }

    const storedUsers = localStorage.getItem("users");
    const users: User[] = storedUsers
      ? (JSON.parse(storedUsers) as User[])
      : [];

    const user = users.find((u) => u.email === formData.email);

    if (!user) {
      toast.error("User Not found !!")
      return;
    }

    const isPasswordMatch = bcrypt.compareSync(
      formData.password,
      user.password
    );



    if (!isPasswordMatch) {
      newError.password = "Wrong password!";
      setError(newError);
      return;
    }

    toast.success("Login successful");
    localStorage.setItem("currentuser", JSON.stringify(user));
    router.replace(`/dashboard/board/${user.id}`);
  }

  return (
    <div className="flex flex-col gap-14 md:gap-20 justify-center  items-center px-8 py-12">
      <div className="flex flex-col justify-center items-center gap-5">
        <Link href="/landing-page">
          <h1 className="text-4xl font-bold">TaskFlow</h1>
        </Link>
        <p className="text-2xl font-medium">Organize Your Work Effortlessly</p>
      </div>
      <form
        className="flex flex-col justify-center bg-slate-950 gap-4 mg:gap-6 rounded-lg  md:min-w-96 px-8 py-10"
        onSubmit={handleSubmit}
      >
        <p className="font-bold text-2xl text-center">Login</p>

        <div className="flex flex-col justify-start gap-2">
          <label>Email </label>
          <input
            type="text"
            name="email"
            placeholder="Enter email"
            className="rounded-lg bg-slate-700 h-8 p-3"
          />
          {error.email && <span className="text-red-600">{error.email}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label>Password</label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter Password"
              className="rounded-lg bg-slate-700 h-8 w-full px-2 pr-10 p-3"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {error.password && (
            <span className="text-red-600">{error.password}</span>
          )}

          {/* <p className="text-left">
            <Link
              href="/signIn"
              className="text-slate-400 hover:text-slate-500"
            >
              Forgot Password ?{" "}
            </Link>
          </p> */}
        </div>

        <button className="bg-slate-400 hover:bg-slate-500 text-slate-950 rounded-lg py-2 mt-4">
          Login
        </button>

        <p className="text-center">
          Not have an account ?{" "}
          <Link href="/signUp" className="text-slate-600 hover:text-slate-500">
            Sign Up{" "}
          </Link>
        </p>
      </form>
    </div>
  );
}
