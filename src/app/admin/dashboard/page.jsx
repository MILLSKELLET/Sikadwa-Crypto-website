import { GoListOrdered } from "react-icons/go";
import { CgGames } from "react-icons/cg";
import { GiMoneyStack } from "react-icons/gi";
import StatCard from "@/components/StatCard";
import prisma from "@/lib/prisma";
import React from "react";
import { FaChartBar, FaUsers } from "react-icons/fa";

export const dynamic = 'force-dynamic'; // This forces SSR


const Dashboard = async () => {
  const orders = await prisma.order.findMany({
    include: {
      odds: true, // Include related Odds data
    },
  });

  // Sum up the prices from the related Odds
  const totalSales = orders.reduce(
    (sum, order) => sum + (order.odds.price || 0),
    0
  );

  const userCount = await prisma.user.count();
  const orderCount = await prisma.order.count();
  const oddsCount = await prisma.odds.count();

  const recentOrders = await prisma.order.findMany({
    orderBy: {
      orderDate: "desc", // Sort by most recent
    },
    take: 5, // Fetch the 5 most recent orders (adjust as needed)
    include: {
      user: true, // Include user details (optional)
      odds: true, // Include odds details
    },
  });

  const recentGames = await prisma.odds.findMany({
    orderBy: {
      games_date: "desc", // Most recent games first
    },
    take: 5, // Get the 5 most recent games
  });


  return (
    <div className="container bg-background">
      {" "}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<FaUsers size={35} />}
          title=" Total Users "
          value={userCount}
        />
        <StatCard
          icon={<FaChartBar size={35} />}
          title="Total Orders"
          value={orderCount}
        />

        <StatCard
          icon={<CgGames size={35} />}
          title="Total Predictions"
          value={oddsCount}
        />

        <StatCard
          icon={<GiMoneyStack size={35} />}
          title="Total Sales"
          value={totalSales}
        />
      </div>
      <div className="w-full flex flex-col lg:flex-row gap-5 py-8 ">
        <div className="flex-1 bg-foreground shadow-md rounded-md p-4">
          {" "}
          <div>
            <h2 className="text- font-semibold mb-4">Recent Orders</h2>
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="mb-2 border border-border shadow- lg hover:shadow-xl transition text-xs p-2"
              >
                <div>
                  <h3 className="font-semibold">User: {order.user.name}</h3>
                  <p>Odds: {order.odds.title}</p>
                  <p>
                    Order Date: {new Date(order.orderDate).toLocaleDateString()}
                  </p>
                  <p>Price: GHS {order.odds.price}</p>
                  <p>
                    Status: <span>{order.status}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 bg-foreground shadow-md rounded-md p-4">
          <div>
            <h2 className="text-x l font-semibold mb-4">Recent Games</h2>
            {recentGames.map((game) => (
              <div
                key={game.id}
                className="mb-2 border border-border shadow- lg hover:shadow-xl transition text-xs p-2"
              >
                <div>
                  <h3 className="font-semibold">{game.title}</h3>
                  <p>Game Date: {game.games_date}</p>
                  <p>Price: GHS {game.price || "Free"}</p>
                  {game.is_free && <div variant="outline">Free</div>}
                  {game.correct_score && (
                    <div className="bg-green-500">Correct Score</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>{" "}
      </div>
    </div>
  );
};

export default Dashboard;
