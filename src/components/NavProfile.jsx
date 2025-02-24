"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

const NavProfile = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return <div>Not logged in</div>;
  }

  const { user } = session;

  return (
    <div className="flex items-center gap-4">
      <span>{user?.name?.substring(0, 6) + ".."}</span>
      <Link
        href={`/${user.role}/dashboard`}
        className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
      >
        Dashboard
      </Link>
      <button
        onClick={() => signOut()}
        className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};

export default NavProfile;
