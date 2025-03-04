"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  NavbarContent,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const UserNavProfile = () => {
  const { data: session, status } = useSession();

  const router = useRouter();
  const [toggle, setToggle] = useState(false);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return <div>Not logged in</div>;
  }

  const { user } = session;

  return (
    <div>
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <div className="flex justify-center gap-3 p-2 rounded-lg">
            <Avatar
              isBordered
              name={user?.name}
              src={user?.profile}
              as="button"
              // color="secondary"
              className="transition-transform"
            />
          </div>
        </DropdownTrigger>
        <DropdownMenu aria-label="Profile Actions" variant="flat">
          <DropdownItem key="profile" className="h-14 gap-2">
            <p className="font-semibold">Signed in as</p>
            <p className="font-semibold">
              {" "}
              {user?.name?.substring(0, 10) + "xxxx"}
            </p>
            <p className="font-semibold"> {user?.email}</p>
          </DropdownItem>
          <DropdownItem key="transactions" as={Link} href="/user/transactions">
            transactions{" "}
          </DropdownItem>
          <DropdownItem key="orders" as={Link} href="/user/orders">
            orders
          </DropdownItem>
          <DropdownItem key="settings" as={Link} href="/user/profile">
            profile Settings
          </DropdownItem>

          <DropdownItem onClick={() => signOut()} key="logout" color="danger">
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default UserNavProfile;
