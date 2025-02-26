"use client";
import { useState } from "react";
import PayButton from "./PayButton";
import { useSession } from "next-auth/react";

const DepositForm = ({ setIsModalOpen }) => {
  const [amount, setAmount] = useState(0);
  const { data: session } = useSession();

  return (
    <div className="w-full flex justify-center items-center">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Deposit Funds</h2>

        <label htmlFor="amount" className="block font-medium">
          Amount:
        </label>
        <input
          onChange={(e) => setAmount(e.target.value)}
          value={amount}
          type="number"
          className="mt-1 w-full mb-2 p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 "
          required
        />

        {session?.user && (
          <PayButton
            setIsModalOpen={setIsModalOpen}
            user={session?.user}
            amount={amount}
          />
        )}
      </div>
    </div>
  );
};

export default DepositForm;
