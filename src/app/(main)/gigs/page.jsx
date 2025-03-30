// "use client";
// import { useState, useEffect } from "react";

// export default function GigsPage() {
//   const [gigs, setGigs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [purchasing, setPurchasing] = useState(false);

//   useEffect(() => {
//     async function fetchGigs() {
//       setLoading(true);
//       try {
//         const response = await fetch("/api/gigs");
//         if (!response.ok) {
//           throw new Error(`Error fetching gigs: ${response.status}`);
//         }
//         const data = await response.json();
//         console.log("Fetched gigs:", data);
//         setGigs(data);
//       } catch (err) {
//         console.error("Failed to fetch gigs:", err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchGigs();
//   }, []);

//   async function buyGig(gig) {
//     setPurchasing(true);
//     try {
//       // Default to buying 1 unit if not specified
//       const amountCrypto = 1;

//       console.log("Buying gig:", {
//         gigId: gig.id,
//         amountCrypto,
//         price: gig.price,
//         currency: gig.currency,
//       });

//       const response = await fetch("/api/gigs/buy", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           gigId: gig.id,
//           amountCrypto,
//         }),
//       });

//       const result = await response.json();
//       console.log("Purchase response:", result);

//       if (response.ok) {
//         // Success message

//         alert("Gig purchased successfully!");

//         // Refresh gigs list
//         const updatedResponse = await fetch("/api/gigs");
//         const updatedData = await updatedResponse.json();
//         setGigs(updatedData);
//       } else {
//         // Handle error from API response
//         throw new Error(result.error || "Failed to purchase gig");
//       }
//     } catch (error) {
//       console.error("Purchase error:", error);
//       alert(`Error: ${error.message}`);
//     } finally {
//       setPurchasing(false);
//     }
//   }

//   if (loading) {
//     return <div className="p-6">Loading gigs...</div>;
//   }

//   if (error) {
//     return <div className="p-6 text-red-500">Error: {error}</div>;
//   }

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-6">Available Gigs</h1>

//       {gigs.length === 0 ? (
//         <p>No gigs available at this time.</p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {gigs.map((gig) => (
//             <div
//               key={gig.id}
//               className="border p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
//             >
//               <div className="flex justify-between items-start">
//                 <h2 className="text-lg font-semibold">{gig.title}</h2>
//                 <span className="px-2 py-1 text-copy bg-gray-100 text-xs rounded-full">
//                   {gig.type}
//                 </span>
//               </div>

//               <p className="text-gray-600 my-3">{gig.description}</p>

//               <div className="mt-4 flex justify-between items-center">
//                 <p className="font-bold text-lg">{gig.price} USD per unit</p>
//                 <p className="text-sm text-gray-500">
//                   {gig.quantityAvailable || 0} {gig.currency} Available
//                 </p>
//               </div>

//               <button
//                 onClick={() => buyGig(gig)}
//                 disabled={
//                   purchasing ||
//                   gig.status !== "active" ||
//                   !(gig.quantityAvailable > 0)
//                 }
//                 className={`w-full mt-4 px-4 py-2 rounded text-white font-medium
//                   ${
//                     purchasing
//                       ? "bg-gray-400"
//                       : gig.status !== "active" || !(gig.quantityAvailable > 0)
//                       ? "bg-gray-300 cursor-not-allowed"
//                       : "bg-green-500 hover:bg-green-600 transition-colors"
//                   }`}
//               >
//                 {purchasing
//                   ? "Processing..."
//                   : gig.status !== "active"
//                   ? "Not Available"
//                   : !(gig.quantityAvailable > 0)
//                   ? "Sold Out"
//                   : `Buy ${gig.currency}`}
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }


"use client";
import { useState, useEffect } from "react";

export default function GigsPage() {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [purchasing, setPurchasing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedGig, setSelectedGig] = useState(null);

  useEffect(() => {
    async function fetchGigs() {
      setLoading(true);
      try {
        const response = await fetch("/api/gigs");
        if (!response.ok) {
          throw new Error(`Error fetching gigs: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched gigs:", data);
        setGigs(data);
      } catch (err) {
        console.error("Failed to fetch gigs:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchGigs();
  }, []);

  function handleGigAction(gig) {
    setSelectedGig(gig);
    setShowConfirmation(true);
  }

  async function confirmGigAction() {
    if (!selectedGig) return;
    
    const gig = selectedGig;
    setShowConfirmation(false);
    setPurchasing(true);
    
    try {
      // Default to buying/selling 1 unit if not specified
      const amountCrypto = 1;

      console.log(`${gig.type === "SELL" ? "Selling" : "Buying"} gig:`, {
        gigId: gig.id,
        amountCrypto,
        price: gig.price,
        currency: gig.currency,
      });

      const response = await fetch("/api/gigs/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gigId: gig.id,
          amountCrypto,
        }),
      });

      const result = await response.json();
      console.log(`${gig.type === "SELL" ? "Sell" : "Purchase"} response:`, result);

      if (response.ok) {
        // Success message
        alert(`Gig ${gig.type === "SELL" ? "sold" : "purchased"} successfully!`);

        // Refresh gigs list
        const updatedResponse = await fetch("/api/gigs");
        const updatedData = await updatedResponse.json();
        setGigs(updatedData);
      } else {
        // Handle error from API response
        throw new Error(result.error || `Failed to ${gig.type === "SELL" ? "sell" : "purchase"} gig`);
      }
    } catch (error) {
      console.error(`${gig.type === "SELL" ? "Sell" : "Purchase"} error:`, error);
      alert(`Error: ${error.message}`);
    } finally {
      setPurchasing(false);
      setSelectedGig(null);
    }
  }

  function cancelGigAction() {
    setShowConfirmation(false);
    setSelectedGig(null);
  }

  if (loading) {
    return <div className="p-6">Loading gigs...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Available Gigs</h1>

      {gigs.length === 0 ? (
        <p>No gigs available at this time.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gigs.map((gig) => (
            <div
              key={gig.id}
              className="border p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-semibold">{gig.title}</h2>
                <span className="px-2 py-1 text-copy bg-primary foreground text-xs rounded-full">
                  {gig.type}
                </span>
              </div>

              <p className="text-gray-600 my-3">{gig.description}</p>

              <div className="mt-4 flex justify-between items-center">
                <p className="font-bold text-lg">{gig.price} USD per unit</p>
                <p className="text-sm text-gray-500">
                  {gig.quantityAvailable || 0} {gig.currency} Available
                </p>
              </div>

              <button
                onClick={() => handleGigAction(gig)}
                disabled={
                  purchasing ||
                  gig.status !== "active" ||
                  !(gig.quantityAvailable > 0)
                }
                className={`w-full mt-4 px-4 py-2 rounded text-white font-medium
                  ${
                    purchasing
                      ? "bg-gray-400"
                      : gig.status !== "active" || !(gig.quantityAvailable > 0)
                      ? "bg-gray-300 cursor-not-allowed"
                      : gig.type === "SELL"
                      ? "bg-red-500 hover:bg-red-600 transition-colors"
                      : "bg-green-500 hover:bg-green-600 transition-colors"
                  }`}
              >
                {purchasing
                  ? "Processing..."
                  : gig.status !== "active"
                  ? "Not Available"
                  : !(gig.quantityAvailable > 0)
                  ? "Sold Out"
                  : gig.type === "SELL"
                  ? `Sell ${gig.currency}`
                  : `Buy ${gig.currency}`}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmation && selectedGig && (
        <div className="fixed inset-0 bg-foreground transparent bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Confirm {selectedGig.type === "SELL" ? "Sell" : "Purchase"}</h2>
            <p className="mb-6">
              Are you sure you want to {selectedGig.type === "SELL" ? "sell" : "buy"} 1 {selectedGig.currency} for {selectedGig.price} USD?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelGigAction}
                className="px-4 py-2 border border-border rounded hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmGigAction}
                className={`px-4 py-2 rounded text-copy font-medium ${
                  selectedGig.type === "SELL"
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                } transition-colors`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}