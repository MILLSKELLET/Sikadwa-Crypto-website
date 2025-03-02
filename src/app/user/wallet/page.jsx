"use client";

import ConversionForm from "@/components/ConversionForm";
import DepositForm from "@/components/DepositForm";
import Modal from "@/components/Modalcomponent";
import {
  ArrowDownUp,
  Download,
  SquareArrowOutUpRight,
  Upload,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const Wallet = () => {

  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ComponentToRender, setComponentToRender] = useState(null);
  const [modalTitle, setModalTitle] = useState("");

  useEffect(() => {
    if (session?.user?.id) {
      const fetchUser = async () => {
        try {
          const response = await fetch("/api/user");
          if (!response.ok) throw new Error("Failed to fetch user data");
          const userData = await response.json();
          setUser(userData);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      fetchUser();
    }
  }, [session, isModalOpen]);

  const handleOpenModal = (Component, title) => {
    setModalTitle(title);
    setComponentToRender(() => Component);
    setIsModalOpen(true);
  };

  if (status === "loading") return <div>Loading...</div>;
  if (status === "unauthenticated") return <div>Not logged in</div>;

  // console.log(user);

  return (
    <>
      <div>
        <h1>Total Balances</h1>
        <div>GHS: {user?.localWallet}</div>
        <div>USD: {user?.usdWallet}</div>
        <div className="flex gap-4 justify-between py-4">
          <div
            onClick={() =>
              handleOpenModal(
                <DepositForm setIsModalOpen={setIsModalOpen} />,
                "Deposit"
              )
            }
            className="flex flex-col items-center text-xs lg:p-4 p-2 w-full border border-border cursor-pointer"
          >
            <Download /> Deposit
          </div>
          <div className="flex flex-col items-center text-xs lg:p-4 p-2 w-full border border-border cursor-pointer">
            <Upload /> Withdraw
          </div>
          <div className="flex flex-col items-center text-xs lg:p-4 p-2 w-full border border-border cursor-pointer">
            <ArrowDownUp /> P2P
          </div>
          <div className="flex flex-col items-center text-xs lg:p-4 p-2 w-full border border-border cursor-pointer">
            <SquareArrowOutUpRight /> Transfer
          </div>
          <div
            onClick={() =>
              handleOpenModal(
                <ConversionForm user={user} setIsModalOpen={setIsModalOpen} />,
                "Conversion"
              )
            }
            className="flex flex-col items-center text-xs lg:p-4 p-2 w-full border border-border cursor-pointer"
          >
            <SquareArrowOutUpRight /> Convert
          </div>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
        maxWidth="sm"
      >
        {ComponentToRender}
      </Modal>
    </>
  );
};

export default Wallet;
