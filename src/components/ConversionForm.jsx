// "use client";

// import { useState, useEffect } from "react";

// const ConversionForm = ({ setIsModalOpen }) => {
//   const [exchangeRate, setExchangeRate] = useState(null);
//   const [amountGHS, setAmountGHS] = useState("");
//   const [amountUSD, setAmountUSD] = useState("");
//   const [preview, setPreview] = useState(null);

//   // Fetch exchange rate on mount
//   useEffect(() => {
//     const fetchRate = async () => {
//       const res = await fetch("/api/wallet/rate");
//       const data = await res.json();
//       if (data.exchangeRate) setExchangeRate(data.exchangeRate);
//     };
//     fetchRate();
//   }, []);

//   const handlePreview = () => {
//     if (!exchangeRate) return;

//     // Calculate preview
//     let ghsToUsd = null;
//     let usdToGhs = null;

//     if (amountGHS) {
//       ghsToUsd = parseFloat((amountGHS / exchangeRate).toFixed(2));
//     }
//     if (amountUSD) {
//       usdToGhs = parseFloat((amountUSD * exchangeRate).toFixed(2));
//     }

//     setPreview({ ghsToUsd, usdToGhs });
//   };

//   const handleConvert = async () => {
//     try {
//       const res = await fetch("/api/wallet/convert", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           userId: "user_object_id_here", // Replace with dynamic user ID
//           amountGHS: amountGHS ? parseFloat(amountGHS) : null,
//           amountUSD: amountUSD ? parseFloat(amountUSD) : null,
//         }),
//       });
//       const data = await res.json();
//       if (data.error) throw new Error(data.error);
//       alert("Conversion successful!");
//     } catch (error) {
//       console.error("Conversion error:", error.message);
//       alert("Conversion failed!");
//     }
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Currency Converter</h2>
//       <p>
//         Exchange Rate:{" "}
//         {exchangeRate ? `1 USD = ${exchangeRate} GHS` : "Loading..."}
//       </p>

//       <div>
//         <label>Amount in GHS:</label>
//         <input
//           type="number"
//           value={amountGHS}
//           onChange={(e) => {
//             setAmountGHS(e.target.value);
//             setAmountUSD("");
//             setPreview(null);
//           }}
//           placeholder="Enter amount in GHS"
//         />
//       </div>

//       <div>
//         <label>Amount in USD:</label>
//         <input
//           type="number"
//           value={amountUSD}
//           onChange={(e) => {
//             setAmountUSD(e.target.value);
//             setAmountGHS("");
//             setPreview(null);
//           }}
//           placeholder="Enter amount in USD"
//         />
//       </div>

//       <button onClick={handlePreview}>Preview Conversion</button>

//       {preview && (
//         <div style={{ marginTop: "20px" }}>
//           <h3>Preview</h3>
//           <p>GHS to USD: {preview.ghsToUsd || "N/A"}</p>
//           <p>USD to GHS: {preview.usdToGhs || "N/A"}</p>
//           <button onClick={handleConvert}>Confirm Conversion</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ConversionForm;



"use client";

import { useState, useEffect } from "react";

export default function ConvertPage({ user }) {
  const [exchangeRate, setExchangeRate] = useState(user?.usdToCedisRate || 0);
  const [inputType, setInputType] = useState("GHS"); // Toggle between GHS and USD
  const [amount, setAmount] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle preview conversion based on input type
  const handlePreview = () => {
    if (!exchangeRate || !amount) return;

    setLoading(true);
    setError("");

    const amountFloat = parseFloat(amount);
    let previewData = null;

    if (inputType === "GHS") {
      if (user.localWallet < amountFloat) {
        setError("Insufficient GHS balance.");
        setLoading(false);
        return;
      }
      previewData = {
        ghsToUsd: parseFloat((amountFloat / exchangeRate).toFixed(2))
      };
    } else {
      if (user.usdWallet < amountFloat) {
        setError("Insufficient USD balance.");
        setLoading(false);
        return;
      }
      previewData = {
        usdToGhs: parseFloat((amountFloat * exchangeRate).toFixed(2))
      };
    }

    setPreview(previewData);
    setLoading(false);
  };

  // Handle actual conversion transaction
  const handleConvert = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/wallet/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          amountGHS: inputType === "GHS" ? parseFloat(amount) : null,
          amountUSD: inputType === "USD" ? parseFloat(amount) : null
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      alert("Conversion successful!");
      setAmount("");
      setPreview(null);
      setLoading(false);
    } catch (error) {
      console.error("Conversion error:", error.message);
      alert("Conversion failed!");
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Currency Converter</h2>
      <p>Exchange Rate: {exchangeRate ? `1 USD = ${exchangeRate} GHS` : "Loading..."}</p>
      <p>Your Balance: {user.localWallet} GHS | {user.usdWallet} USD</p>

      <div style={{ margin: "10px 0" }}>
        <label>Choose Input Currency:</label>
        <select
          value={inputType}
          onChange={(e) => {
            setInputType(e.target.value);
            setAmount("");
            setPreview(null);
            setError("");
          }}
        >
          <option value="GHS">GHS</option>
          <option value="USD">USD</option>
        </select>
      </div>

      <div>
        <label>Amount in {inputType}:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            setPreview(null);
            setError("");
          }}
          placeholder={`Enter amount in ${inputType}`}
        />
      </div>

      <button onClick={handlePreview} disabled={loading}>
        {loading ? "Checking Balance..." : "Preview Conversion"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {preview && (
        <div style={{ marginTop: "20px" }}>
          <h3>Preview</h3>
          {inputType === "GHS" ? (
            <p>GHS to USD: {preview.ghsToUsd}</p>
          ) : (
            <p>USD to GHS: {preview.usdToGhs}</p>
          )}
          <button onClick={handleConvert} disabled={loading}>
            {loading ? "Converting..." : "Confirm Conversion"}
          </button>
        </div>
      )}
    </div>
  );
}
