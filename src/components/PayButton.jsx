"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

// Dynamically import PaystackButton with SSR disabled
const PaystackButton = dynamic(
  () => import("react-paystack").then((mod) => mod.PaystackButton),
  { ssr: false }
);

export default function PayButton({ user, amount, setIsModalOpen }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [paystackKey, setPaystackKey] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPaystackKey(process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY);
    }
  }, []);

  if (!paystackKey) return null; // Ensure Paystack key is loaded before rendering

  const config = {
    reference: `deposit_${Date.now()}_${Math.random()
      .toString(36)
      .substring(7)}`,
    email: user.email,
    amount: amount * 100, // Convert to kobo
    currency: "GHS",
    publicKey: paystackKey,
  };

  const handlePaymentSuccess = async (reference) => {
    console.log("Payment Success:", reference);
    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/api/verify-payment`,
        {
          userId: user.id,
          amount: amount,
          reference: reference.reference,
        }
      );

      if (response.data.paymentStatus === "success") {
        alert("Payment successful! Your deposit is confirmed.");
        setIsModalOpen(false);
        router.refresh(); // Refresh the page to update the wallet balances
      } else {
        alert("Payment pending. Please check your dashboard.");
      }
    } catch (error) {
      console.error("Payment verification failed:", error);
      alert("Payment verification failed.");
    } finally {
      setLoading(false);
    }
  };

  // Handle button click to prevent reload
  const handleClick = (e) => {
    e.preventDefault(); // Prevent default form submission
  };

  return (
    <div>
      <PaystackButton
        {...config}
        text={loading ? "Processing..." : "Deposit"}
        onSuccess={handlePaymentSuccess}
        onClose={() => alert("Payment cancelled")}
        className="bg-green-500 text-white px-4 py-2 w-full rounded-md cursor-pointer"
        disabled={loading}
        onClick={handleClick} // Prevent page reload
      />
    </div>
  );
}
