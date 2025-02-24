export const getOddsData = async (odds) => {
  try {
    const response = await fetch(
      `https://www.sportybet.com/api/gh/orders/share/${odds}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch odds data");
    }

    const data = await response.json();

    // Update isWinning to return "won" or "loss" if match has ended
    data.data.outcomes = data.data.outcomes.map((match) => ({
      ...match,
      markets: match.markets.map((market) => ({
        ...market,
        outcomes: market.outcomes.map((outcome) => ({
          ...outcome,
          isWinning:
            match.matchStatus === "Ended"
              ? outcome.isWinning === 1
                ? "won"
                : "loss"
              : "pending", // For matches not ended yet
        })),
      })),
    }));

    return data;
  } catch (error) {
    console.error("Error fetching odds data:", error);
    return null;
  }
};


export const getBetSlipStatus = async (odds) => {
    try {
      const response = await fetch(
        `https://www.sportybet.com/api/gh/orders/share/${odds}`,
        { cache: "no-store" }
      );
  
      if (!response.ok) {
        throw new Error("Failed to fetch odds data");
      }
  
      const data = await response.json();
  
      // Collect the status of all outcomes in the bet slip
      const outcomesStatus = data.data.outcomes.flatMap((match) =>
        match.markets.flatMap((market) =>
          market.outcomes.map((outcome) => {
            if (match.matchStatus !== "Ended") return "pending";
            return outcome.isWinning === 1 ? "won" : "loss";
          })
        )
      );
  
      // Determine overall bet slip status
      if (outcomesStatus.includes("loss")) return "loss"; // Any loss = full loss
      if (outcomesStatus.includes("pending")) return "pending"; // Any pending = still running
      return "won"; // All won = full win
    } catch (error) {
      console.error("Error fetching bet slip data:", error);
      return null;
    }
  };
  
