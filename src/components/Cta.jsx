"use client";
import Link from "next/link";
import React from "react";

const Cta = () => {
  return (
    <div className="bg-primary-light text-white py-10">
      <div className="container mx-auto text-center px-4">
        <h2 className="text-2xl font-bold mb-4">
          Ready to Take Your Finances to the Next Level?
        </h2>
        <p className="text-base mb-6">
        qqqq
        </p>
        <Link href="/register" className="bg-secondary hover:bg-secondary-dark text-white font-semibold py-3 px-8 rounded-lg transition duration-300">
          Get Started Now
        </Link>
      </div>
    </div>
  );
};

export default Cta;
