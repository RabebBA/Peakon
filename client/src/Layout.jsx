import React from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const Layout = ({ children }) => {
  return (
    <div className="h-full bg-slate-100">
      <Navbar />
      <main className="pb-20 bg-slate-100">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
