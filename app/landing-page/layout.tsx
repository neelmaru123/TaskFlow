import Header from "@/app/_components/Header";
import "../globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Trello Clone",
  description: "List and card making app",
};

type MainLayoutProps = {
  children: ReactNode;
};

export default function MainLayout({ children } : MainLayoutProps) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
