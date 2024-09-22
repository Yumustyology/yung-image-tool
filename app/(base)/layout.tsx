import MobileNav from "@/components/organisms/MobileNav";
import Sidebar from "@/components/organisms/Sidebar";
import React, { ReactNode } from "react";

export const layout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="base">
      <Sidebar />
      <MobileNav />
      <div className="base-container">
        <div className="wrapper">{children}</div>
      </div>
    </main>
  );
};

export default layout;
