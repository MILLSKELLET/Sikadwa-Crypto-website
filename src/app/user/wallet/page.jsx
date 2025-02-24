import {
  ArrowDownUp,
  Download,
  SquareArrowOutUpRight,
  Upload,
} from "lucide-react";
import React from "react";

const Wallet = () => {

  return (
    <div>
      <div>
        <h1>total Balances</h1>
        <div>GHS: </div>
        <div>USD:</div>
      </div>
      <div className="flex gap-4 justify-between py-4">
        <div className="flex flex-col items-center text-xs lg:p-4 p-2 w-full border border-border">
          {" "}
          <Download /> Deposit{" "}
        </div>
        <div className="flex flex-col items-center text-xs lg:p-4 p-2 w-full border border-border">
          <Upload />
          Withdraw
        </div>
        <div className="flex flex-col items-center text-xs lg:p-4 p-2 w-full border border-border">
          <ArrowDownUp /> P2P
        </div>
        <div className="flex flex-col items-center text-xs lg:p-4 p-2 w-full border border-border">
          <SquareArrowOutUpRight />
          transfer
        </div>
      </div>
    </div>
  );
};

export default Wallet;
