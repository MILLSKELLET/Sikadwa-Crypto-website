import { GoListOrdered } from "react-icons/go";
import { CgGames } from "react-icons/cg";
import { GiMoneyStack } from "react-icons/gi";
import StatCard from "@/components/StatCard";
import prisma from "@/lib/prisma";
import React from "react";
import { FaChartBar, FaUsers } from "react-icons/fa";

export const dynamic = "force-dynamic"; // This forces SSR

const Dashboard = async () => {
  return (
    <div className="container bg-background">
      {" "}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<FaUsers size={35} />}
          title=" Total Users "
          value={0}
        />
        <StatCard
          icon={<FaChartBar size={35} />}
          title="Total Orders"
          value={0}
        />

        <StatCard
          icon={<GiMoneyStack size={35} />}
          title="Total Sales"
          value={0}
        />
      </div>
    </div>
  );
};

export default Dashboard;
