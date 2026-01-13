

import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import "./globals.css";

type RootLayoutProps = {
  children: ReactNode;
};


export default function RootLayout({ children } : RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <title>TaskFlow</title>
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-slate-900">
        {children}
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            style: {
              background: "#020617",
              color: "#fff",
            },
          }}
        />
      </body>
    </html>
  );
}
