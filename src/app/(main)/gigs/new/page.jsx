"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateGigPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [currency, setCurrency] = useState("BTC");
  const [price, setPrice] = useState("");
  const [quantityAvailable, setQuantityAvailable] = useState("");
  const [type, setType] = useState("SELL"); // Default to SELL

  console.log(type);
  async function submitGig(e) {
    e.preventDefault();
    const response = await fetch("/api/gigs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        currency,
        price: parseFloat(price),
        quantityAvailable: parseFloat(quantityAvailable),
        type,
      }),
    });

    if (response.ok) {
      alert("Gig created successfully!");
      router.push("/gigs");
    } else {
      alert("Failed to create gig");
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Create a New Gig</h1>
      <form onSubmit={submitGig} className="space-y-4">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="SELL">Sell Crypto</option>
          <option value="BUY">Buy Crypto</option>
        </select>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="border p-2 w-full"
        />
        <input
          type="number"
          placeholder="Price per unit"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="border p-2 w-full"
        />
        <input
          type="number"
          placeholder="Total Quantity"
          value={quantityAvailable}
          onChange={(e) => setQuantityAvailable(e.target.value)}
          required
          className="border p-2 w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create Gig
        </button>
      </form>
    </div>
  );
}
