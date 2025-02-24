"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search } from "lucide-react";

const CryptoPriceTracker = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const cryptoIds = [
    "bitcoin",
    "ethereum",
    "binancecoin",
    "solana",
    "ripple",
    "cardano",
    "avalanche-2",
    "dogecoin",
    "polkadot",
    "chainlink",
    "polygon",
    "shiba-inu",
    "litecoin",
    "uniswap",
    "bitcoin-cash",
    "stellar",
    "monero",
    "cosmos",
    "filecoin",
    "vechain",
    "tron",
    "near",
    "aave",
    "algorand",
    "tezos",
    "theta-token",
    "fantom",
    "the-sandbox",
    "decentraland",
    "axie-infinity",
  ];

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoIds.join(
          ","
        )}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_last_updated_at=true`
      );

      const formattedData = Object.entries(response.data).map(([id, data]) => ({
        id,
        price: data.usd,
        change24h: data.usd_24h_change,
        marketCap: data.usd_market_cap,
        lastUpdated: new Date(data.last_updated_at * 1000),
      }));

      // Sort by market cap
      formattedData.sort((a, b) => b.marketCap - a.marketCap);

      setCryptoData(formattedData);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch crypto data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const filteredCryptoData = cryptoData.filter((crypto) =>
    crypto.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4 min-h-screen overflow-auto">
      <div className="mb-6 relative">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-copy"
            size={20}
          />
          <input
            type="text"
            placeholder="Search cryptocurrencies..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-foreground rounded-lg shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-primary border-2">
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Coin
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                  24h Change
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                  Market Cap
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCryptoData.map((crypto) => (
                <tr key={crypto.id} className="hover:bg-background">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium capitalize">
                      {crypto.id.replace(/-/g, " ")}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div className="font-medium">
                      $
                      {crypto.price?.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div
                      className={`font-medium ${
                        crypto.change24h >= 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {crypto.change24h?.toFixed(2)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div className="text-primary-content">
                      $
                      {crypto.marketCap?.toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CryptoPriceTracker;
