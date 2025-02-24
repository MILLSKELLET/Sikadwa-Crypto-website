"use client";
import { FaBars } from "react-icons/fa";
import Link from "next/link";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@heroui/react";
import { useSession } from "next-auth/react";
import NavProfile from "./NavProfile";
import ThemeToggleButton from "./ThemeToggleButton";

export default function Navbar() {
  const { data: session, status } = useSession();

  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu when clicking outside
  const handleOverlayClick = (e) => {
    if (e.target.id === "mobile-menu-overlay") {
      setIsMenuOpen(false);
    }
  };

  const menuItems = [
    { name: "Home", link: "/" },
    { name: "market", link: "/market" },
    { name: "stake", link: "/#stake" },
  ];

  const menuList = (
    <>
      {menuItems.map((item, index) => (
        <Link
          key={`${item}-${index}`}
          className="hover:text-gray-400 capitalize font-semibold"
          href={item.link}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {item.name}
        </Link>
      ))}
      {!session ? (
        <>
          <Button
            onPress={() => setIsMenuOpen(!isMenuOpen)}
            color="secondary"
            variant="ghost"
            as={Link}
            href="/login"
          >
            Login
          </Button>
          <Button
            onPress={() => setIsMenuOpen(!isMenuOpen)}
            color="secondary"
            as={Link}
            href="/register"
          >
            Register
          </Button>
        </>
      ) : (
        <NavProfile />
      )}
      <ThemeToggleButton/>
    </>
  );

  return (
    <header
      className={`top-0 fixed z-50 w-full bg-foreground primary text-copy `}
    >
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <div className="lg:text-2xl text-base font-bold">
          <a href="/">Crypto P@P</a>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden space-x-6 md:flex justify-center items-center">
          {menuList}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="block text-2xl md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? "✖" : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          id="mobile-menu-overlay"
          className="z-50 fixed inset-0 flex flex-col items-center justify-center space-y-6 bg-gray-900 bg-opacity-90 text-center text-2xl md:hidden"
          onClick={handleOverlayClick}
        >
          <div className="flex flex-col justify-center items-center gap-5 ">
            {menuList}
          </div>
        </div>
      )}
    </header>
  );
}
