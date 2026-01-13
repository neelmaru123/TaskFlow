import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/landing-page"); // or dashboard
}