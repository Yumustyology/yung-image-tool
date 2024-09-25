import MobileNav from "@/components/organisms/MobileNav";
import Sidebar from "@/components/organisms/Sidebar";
import { Toaster } from "@/components/ui/toaster";
import React, { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="base">
      <Sidebar />
      <MobileNav />
      <div className="base-container">
        <div className="wrapper">{children}</div>
      </div>
      <Toaster />
    </main>
  );
};

export default layout;
