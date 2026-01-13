"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type CurrentUser = {
  id: number;
  email?: string;
};

export default function Home() {
  const router = useRouter();

  function handleGetStrated(): void {
    const storedUser = localStorage.getItem("currentuser");

    const user = storedUser ? (JSON.parse(storedUser) as CurrentUser) : null;

    if (!user) {
      toast.error("Please login to continue");
      router.push("/login");
      return;
    }

    router.push(`/dashboard/board/${user.id}`);
  }

  return (
    <main className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 min-h-screen">
      {/* Hero Section */}
      <section className="flex flex-col justify-center items-center gap-8 px-8 md:px-16 py-20 md:py-32 text-center">
        <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
          Organize Your Work <br />
          <span className="bg-gradient-to-r from-slate-400 to-slate-300 bg-clip-text text-transparent">
            Effortlessly
          </span>
        </h2>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl">
          Collaborate with your team, manage projects, and boost productivity
          with our intuitive task management platform.
        </p>

        <button
          onClick={handleGetStrated}
          className="bg-gradient-to-r from-slate-400 to-slate-500 hover:from-slate-300 hover:to-slate-400 text-slate-950 font-bold py-4 px-10 rounded-lg transition transform hover:scale-105 shadow-lg text-lg mt-4"
        >
          Get Started
        </button>
      </section>

      {/* Features Section */}
      {/* <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-8 md:px-16 py-20">
        {[
          {
            icon: FaTasks,
            title: "Task Management",
            description: "Create, organize, and track tasks with ease",
          },
          {
            icon: FaUsers,
            title: "Team Collaboration",
            description: "Work together with your team in real-time",
          },
          {
            icon: FaChartLine,
            title: "Progress Tracking",
            description: "Monitor project progress and productivity",
          },
          {
            icon: FaCheckCircle,
            title: "Completion Tracking",
            description: "Mark tasks complete and celebrate wins",
          },
        ].map((feature, index) => (
          <div
            key={index}
            className="bg-slate-800 hover:bg-slate-700 transition rounded-lg p-6 border border-slate-700 hover:border-slate-600"
          >
            <feature.icon className="text-slate-400 text-4xl mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
            <p className="text-slate-400">{feature.description}</p>
          </div>
        ))}
      </section> */}

      {/* CTA Section */}
      {/* <section className="bg-slate-800 bg-opacity-50 mx-8 md:mx-16 my-20 rounded-lg p-12 border border-slate-700 text-center">
        <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to transform your workflow?
        </h3>
        <p className="text-slate-400 mb-8 max-w-xl mx-auto">
          Join thousands of teams already using TaskFlow to organize their work and improve collaboration.
        </p>
        <Link
          href="/signUp"
          className="inline-block bg-slate-400 hover:bg-slate-500 text-slate-950 font-bold py-3 px-8 rounded-lg transition"
        >
          Start Your Free Trial
        </Link>
      </section> */}

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-700 px-8 md:px-16 py-12 text-center text-slate-500">
        <p>&copy; 2026 TaskFlow. All rights reserved.</p>
      </footer>
    </main>
  );
}
