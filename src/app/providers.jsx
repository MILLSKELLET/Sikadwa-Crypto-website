"use client";

import { HeroUIProvider } from "@heroui/react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";

export function Providers({ children }) {
  return (
    <SessionProvider>
      <ThemeProvider  defaultTheme="light" attribute="class">
        <HeroUIProvider>{children}</HeroUIProvider>
      </ThemeProvider>{" "}
    </SessionProvider>
  );
}
