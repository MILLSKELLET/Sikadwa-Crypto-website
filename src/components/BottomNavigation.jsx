"use client";
import React from "react";
import { Home, Search, Heart, User } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const BottomNavigation = () => {
  const pathname = usePathname();

  const navItems = [
    { id: "Market", label: "Market", icon: Search, link: "/market" },
    { id: "trade", label: "Trade", icon: Heart, link: "/user/trade" },
    { id: "wallet", label: "Wallet", icon: Heart, link: "/user/wallet" },
    { id: "profile", label: "Profile", icon: User, link: "/user/profile" },
  ];

  const isActive = (path) => pathname.includes(path);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-foreground border-t-2 border-border ">
      <nav className="flex items-center justify-around h-16">
        {navItems.map(({ id, label, icon: Icon, link }) => (
          <Link
            key={id}
            href={link}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1
              ${isActive(link) ? "text-blue-600" : "text-gray-600"}`}
          >
            <Icon
              className={`w-6 h-6 ${isActive(link) ? "animate-bounce" : ""}`}
            />
            <span className="text-xs font-medium">{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default BottomNavigation;
