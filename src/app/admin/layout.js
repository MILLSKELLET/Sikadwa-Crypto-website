"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Layout = ({ children }) => {
  const pathname = usePathname();

  const links = [
    { href: "/admin/dashboard", label: "Home" },
    { href: "/admin/games", label: "Games" },
    { href: "/admin/orders", label: "Orders" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/settings", label: "Settings" },
   
  ];
  return (
    <div className="container mx-auto flex min-h-screen gap-8 p-4 pt-8">
      {/* <div className="flex min-w-[5rem] lg:min-w-[10rem] flex-col gap-4 rounded-xl bg-foreground p-4 shadow-lg">
        <h2 className="text-xl font-bold">Sidebar</h2>
        <nav className="flex flex-col gap-2">
          {links.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className={`rounded-md px-3 lg:text-base text-xs py-2 transition-all ${
                pathname === link.href
                  ? "bg-secondary text-black"
                  : "hover:bg-secondary"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div> */}
      <div className="w-full">{children}</div>
    </div>
  );
};

export default Layout;
