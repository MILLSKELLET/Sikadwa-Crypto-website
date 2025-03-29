"use client";
import { useState, useEffect } from "react";

export default function GigsPage() {
  const [gigs, setGigs] = useState([]);

  useEffect(() => {
    async function fetchGigs() {
      const response = await fetch("/api/gigs");
      const data = await response.json();
      setGigs(data);
    }
    fetchGigs();
  }, []);

  async function buyGig(gigId) {
    const response = await fetch("/api/gigs/buy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gigId }),
    });

    if (response.ok) {
      alert("Gig purchased successfully!");
    } else {
      alert("Failed to purchase gig");
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Available Gigs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {gigs.map((gig) => (
          <div key={gig.id} className="border p-4 rounded">
            <h2 className="text-lg font-semibold">{gig.title}</h2>
            <p>{gig.description}</p>
            <p className="font-bold">{gig.price} {gig.currency}</p>
            <button onClick={() => buyGig(gig.id)} className="bg-green-500 text-white px-4 py-2 rounded mt-2">Buy Gig</button>
          </div>
        ))}
      </div>
    </div>
  );
}
