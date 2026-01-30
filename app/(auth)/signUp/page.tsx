"use client";

import Link from "next/link";
import { useState } from "react";
import bcrypt from "bcryptjs";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";

type ErrorState = {
  username: string;
  contactNumber: string;
  email: string;
  password: string;
};

type User = {
  id: number;
  username: string;
  contactNumber: string;
  email: string;
  password: string;
};

function Page() {
  const [error, setError] = useState<ErrorState>({
    username: "",
    contactNumber: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const router = useRouter();

  function hashPassword(password: string): string {
    const hashedPassword = bcrypt.hashSync(password, 10);
    return hashedPassword;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const fd = new FormData(e.currentTarget);
    const formData = Object.fromEntries(fd.entries()) as Record<string, string>;

    const newError = {
      username: "",
      contactNumber: "",
      email: "",
      password: "",
    };

    if (!formData.username.trim()) {
      newError.username = "Username is required";
    } 

    if (!formData.contactNumber.trim()) {
      newError.contactNumber = "Contact Number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.contactNumber)) {
      newError.contactNumber = "Contact Number is invalid";
    }

    if (!formData.email.trim()) {
      newError.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newError.email = "Email is invalid";
    }

    if (!formData.password.trim()) {
      newError.password = "Password is required";
    } else if(formData.password.length < 8) {
      newError.password = "Password must have minimum 8 charactors"
    }

    const storedUsers = localStorage.getItem("users");
    const users: User[] = storedUsers ? JSON.parse(storedUsers) as User[] : [];

    if (users.some((u) => u.email === formData.email)) {
      newError.email = "User already exist with same email";
    }

    setError(newError);

    if (Object.values(newError).some((msg) => msg !== "")) {
      return;
    }

    const hashed = hashPassword(formData.password);

    const newUser: User = {
      id: Math.floor(Date.now() + Math.random()),
      username: formData.username,
      contactNumber: formData.contactNumber,
      email: formData.email,
      password: hashed,
    };

    users.push(newUser);

    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentuser", JSON.stringify(newUser));

    toast.success("Registered successfully");

    router.replace(`/dashboard/board/${newUser.id}`);
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
        <p className="font-bold text-2xl text-center">Sign up</p>

        <div className="flex flex-col justify-start gap-2">
          <label>UserName </label>
          <input
            type="text"
            name="username"
            className="rounded-lg bg-slate-700 h-8 p-2"
          />
          {error.username && (
            <span className="text-red-600">{error.username}</span>
          )}
        </div>

        <div className="flex flex-col justify-start gap-2">
          <label>Contact Number </label>
          <input
            type="number"
            name="contactNumber"
            className="rounded-lg bg-slate-700 h-8 p-2"
            maxLength={10}
          />
          {error.contactNumber && (
            <span className="text-red-600">{error.contactNumber}</span>
          )}
        </div>

        <div className="flex flex-col justify-start gap-2">
          <label>Email </label>
          <input
            type="text"
            name="email"
            className="rounded-lg bg-slate-700 h-8 p-2"
          />
          {error.email && <span className="text-red-600">{error.email}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label>Password</label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="rounded-lg bg-slate-700 h-8 w-full px-2 pr-10"
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
        </div>

        <button className="bg-slate-400 hover:bg-slate-500 text-slate-950 rounded-lg py-2 mt-4">
          Sign Up
        </button>

        <p className="text-center">
          Already have an account ?{" "}
          <Link href="/login" className="text-slate-600 hover:text-slate-500">
            LogIn{" "}
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Page;
