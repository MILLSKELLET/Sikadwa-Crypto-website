"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Layout = ({ children }) => {
  const pathname = usePathname();

  return (
    <div className="container mx-auto gap-8 p-4 pt-8">
      <div className="w-full">{children}</div>
    </div>
  );
};

export default Layout;
