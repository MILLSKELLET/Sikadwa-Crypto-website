"use client";
import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function fetchOrders() {
      const response = await fetch("/api/orders");
      const data = await response.json();
      setOrders(data);
    }
    fetchOrders();
  }, []);

  async function updateOrderStatus(orderId, status) {
    const response = await fetch("/api/orders/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status }),
    });

    if (response.ok) {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status } : order
        )
      );
      alert(`Order marked as ${status}`);
    } else {
      alert("Failed to update order");
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border p-4 rounded">
            <p>Order ID: {order.id}</p>
            <p>Currency: {order.currency}</p>
            <p>Amount: {order.amountUSD} USD</p>
            <p>Status: <strong>{order.status}</strong></p>

            {order.status === "PENDING" && (
              <div className="space-x-2">
                <button
                  onClick={() => updateOrderStatus(order.id, "COMPLETED")}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Mark as Completed
                </button>
                <button
                  onClick={() => updateOrderStatus(order.id, "CANCELLED")}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Cancel Order
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
