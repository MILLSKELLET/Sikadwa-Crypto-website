// "use client";
// import { usePaystackPayment } from "react-paystack";

// import { useState } from "react";
// import axios from "axios";

// export default function PayButton({ user, odds }) {
//   console.log("====================================");
//   // console.log(user);
//   // console.log(odds);
//   console.log("====================================");
//   const [loading, setLoading] = useState(false);

//   const config = {
//     reference: `bet_${Date.now()}_${Math.random().toString(36).substring(7)}`,
//     email: user.email,
//     amount: odds.price * 100, // Convert to kobo (smallest Paystack unit)
//     currency: "GHS",
//     publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
//   };

//   const initializePayment = usePaystackPayment(config);

//   const handlePaymentSuccess = async (reference) => {
//     try {
//       setLoading(true);

//       console.log('====================================');
//       console.log("sucess");
//       console.log('====================================');

//       // Send reference to the backend for verification
//       const response = await axios.post(`${NEXT_PUBLIC_URL}/api/verify-payment`, {
//         userId: user.id,
//         oddsId: odds.id,
//         reference: reference.reference, // Store Paystack reference
//       });

//       if (response.data.paymentStatus === "success") {
//         alert("Payment successful! Your order is confirmed.");
//       } else {
//         alert("Payment pending. Please check your dashboard.");
//       }
//     } catch (error) {
//       console.error("Payment verification failed:", error);
//       alert("Payment verification failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <button
//       onClick={() => {
//         initializePayment(handlePaymentSuccess, () =>
//           alert("Payment cancelled")
//         );
//       }}
//       disabled={loading}
//       className="bg-green-500 text-white px-4 py-2 rounded-md"
//     >
//       {loading ? "Processing..." : "Buy Now"}
//     </button>
//   );
// }




"use client";
import { PaystackButton } from "react-paystack";
import { useState } from "react";
import axios from "axios";

export default function PayButton({ user, odds }) {
  const [loading, setLoading] = useState(false);

  const config = {
    reference: `bet_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    email: user.email,
    amount: odds.price * 100, // Convert to kobo
    currency: "GHS",
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
  };

  const handlePaymentSuccess = async (reference) => {
    console.log("Payment Success:", reference);
    try {
      setLoading(true);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/api/verify-payment`,
        {
          userId: user.id,
          oddsId: odds.id,
          reference: reference.reference, // Store Paystack reference
        }
      );

      if (response.data.paymentStatus === "success") {
        alert("Payment successful! Your order is confirmed.");
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

  return (
    <PaystackButton
      {...config}
      text={loading ? "Processing..." : "Buy Now"}
      onSuccess={(reference) => {
        console.log("Success callback triggered:", reference);
        handlePaymentSuccess(reference);
      }}
      onClose={() => alert("Payment cancelled")}
      className="bg-green-500 text-white px-4 py-2 rounded-md"
      disabled={loading}
    />
  );
}
