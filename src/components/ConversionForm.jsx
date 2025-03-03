// "use client";

// import { useState, useEffect } from "react";

// export default function ConvertPage({ user, setIsModalOpen }) {
//   const [usdToCedisRate, setUsdToCedisRate] = useState(user?.usdToCedisRate || 0);
//   const [cedisToUsdRate, setCedisToUsdRate] = useState(user?.cedisToUsdRate || 0);
//   const [inputType, setInputType] = useState("GHS"); // Toggle between GHS and USD
//   const [amount, setAmount] = useState("");
//   const [preview, setPreview] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // Handle preview conversion based on input type
//   const handlePreview = () => {
//     if ((!usdToCedisRate && inputType === "USD") || (!cedisToUsdRate && inputType === "GHS") || !amount) return;

//     setLoading(true);
//     setError("");

//     const amountFloat = parseFloat(amount);
//     let previewData = null;

//     if (inputType === "GHS") {
//       if (user.localWallet < amountFloat) {
//         setError("Insufficient GHS balance.");
//         setLoading(false);
//         return;
//       }
//       previewData = {
//         ghsToUsd: parseFloat((amountFloat / cedisToUsdRate).toFixed(2)),
//         rateUsed: cedisToUsdRate,
//       };
//     } else {
//       if (user.usdWallet < amountFloat) {
//         setError("Insufficient USD balance.");
//         setLoading(false);
//         return;
//       }
//       previewData = {
//         usdToGhs: parseFloat((amountFloat * usdToCedisRate).toFixed(2)),
//         rateUsed: usdToCedisRate,
//       };
//     }

//     setPreview(previewData);
//     setLoading(false);
//   };

//   // Handle actual conversion transaction
//   const handleConvert = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch("/api/wallet/convert", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           userId: user.id,
//           amountGHS: inputType === "GHS" ? parseFloat(amount) : null,
//           amountUSD: inputType === "USD" ? parseFloat(amount) : null,
//         }),
//       });
//       const data = await res.json();
//       if (data.error) throw new Error(data.error);
//       alert("Conversion successful!");
//       setAmount("");
//       setPreview(null);
//       setLoading(false);
//       setIsModalOpen(false);
//     } catch (error) {
//       console.error("Conversion error:", error.message);
//       alert("Conversion failed!");
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Currency Converter</h2>
//       <p>
//         Exchange Rate:{" "}
//         {inputType === "GHS"
//           ? `1 GHS = ${(1 / cedisToUsdRate).toFixed(4)} USD`
//           : `1 USD = ${usdToCedisRate} GHS`}
//       </p>
//       <p>
//         Your Balance: {user.localWallet} GHS | {user.usdWallet} USD
//       </p>

//       <div style={{ margin: "10px 0" }}>
//         <label>Choose Input Currency:</label>
//         <select
//           value={inputType}
//           onChange={(e) => {
//             setInputType(e.target.value);
//             setAmount("");
//             setPreview(null);
//             setError("");
//           }}
//         >
//           <option value="GHS">GHS</option>
//           <option value="USD">USD</option>
//         </select>
//       </div>

//       <div>
//         <label>Amount in {inputType}:</label>
//         <input
//           type="number"
//           value={amount}
//           onChange={(e) => {
//             setAmount(e.target.value);
//             setPreview(null);
//             setError("");
//           }}
//           placeholder={`Enter amount in ${inputType}`}
//         />
//       </div>

//       <button onClick={handlePreview} disabled={loading}>
//         {loading ? "Checking Balance..." : "Preview Conversion"}
//       </button>

//       {error && <p style={{ color: "red" }}>{error}</p>}

//       {preview && (
//         <div style={{ marginTop: "20px" }}>
//           <h3>Preview</h3>
//           {inputType === "GHS" ? (
//             <>
//               <p>GHS to USD: {preview.ghsToUsd}</p>
//               <p>Rate Used: 1 GHS = {(1 / preview.rateUsed).toFixed(4)} USD</p>
//             </>
//           ) : (
//             <>
//               <p>USD to GHS: {preview.usdToGhs}</p>
//               <p>Rate Used: 1 USD = {preview.rateUsed} GHS</p>
//             </>
//           )}
//           <button onClick={handleConvert} disabled={loading}>
//             {loading ? "Converting..." : "Confirm Conversion"}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";

export default function ConvertPage({ user, setIsModalOpen }) {
  const [usdToCedisRate, setUsdToCedisRate] = useState(0);
  const [cedisToUsdRate, setCedisToUsdRate] = useState(0);
  const [inputType, setInputType] = useState("GHS");
  const [amount, setAmount] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch exchange rates from the new API route
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch("/api/wallet/rate");
        const data = await res.json();
        if (data.error) throw new Error(data.error);

        setUsdToCedisRate(data.usdToCedisRate);
        setCedisToUsdRate(data.cedisToUsdRate);
      } catch (err) {
        console.error("Failed to fetch exchange rates:", err.message);
      }
    };

    fetchRates();
  }, []);

  // Handle preview conversion based on input type
  const handlePreview = () => {
    if ((!usdToCedisRate && inputType === "USD") || (!cedisToUsdRate && inputType === "GHS") || !amount) return;

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
        ghsToUsd: parseFloat((amountFloat / cedisToUsdRate).toFixed(2)),
        rateUsed: cedisToUsdRate,
      };
    } else {
      if (user.usdWallet < amountFloat) {
        setError("Insufficient USD balance.");
        setLoading(false);
        return;
      }
      previewData = {
        usdToGhs: parseFloat((amountFloat * usdToCedisRate).toFixed(2)),
        rateUsed: usdToCedisRate,
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
          amountUSD: inputType === "USD" ? parseFloat(amount) : null,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      alert("Conversion successful!");
      setAmount("");
      setPreview(null);
      setLoading(false);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Conversion error:", error.message);
      alert("Conversion failed!");
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Currency Converter</h2>
      <p>
        Exchange Rate:{" "}
        {inputType === "GHS"
          ? `1 GHS = ${(1 / cedisToUsdRate).toFixed(4)} USD`
          : `1 USD = ${usdToCedisRate} GHS`}
      </p>
      <p>
        Your Balance: {user.localWallet} GHS | {user.usdWallet} USD
      </p>

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
            <>
              <p>GHS to USD: {preview.ghsToUsd}</p>
              <p>Rate Used: 1 GHS = {(1 / preview.rateUsed).toFixed(4)} USD</p>
            </>
          ) : (
            <>
              <p>USD to GHS: {preview.usdToGhs}</p>
              <p>Rate Used: 1 USD = {preview.rateUsed} GHS</p>
            </>
          )}
          <button onClick={handleConvert} disabled={loading}>
            {loading ? "Converting..." : "Confirm Conversion"}
          </button>
        </div>
      )}
    </div>
  );
}
