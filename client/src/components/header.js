"use client";
import { Web3Button } from "@web3modal/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAccount } from "wagmi";

export default function Header() {
  const pathname = usePathname();
  const { address, isConnected } = useAccount();

  return (
    <div className="flex justify-between ">
      {address === "0x47039C514D7d06DA97a1B6c61931dAF710Aa50bF" ? (
        <Link
          className="nline-block px-4 py-2 font-semibold text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300"
          href={pathname === "/" ? "/admin" : "/"}
        >
          {pathname === "/" ? "Admin Page" : "Home"}
        </Link>
      ) : (
        <>`</>
      )}
      <Web3Button />
    </div>
  );
}
