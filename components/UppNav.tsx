"use client";
import React from "react";
import { useAddress, useDisconnect, useMetamask } from "@thirdweb-dev/react";
import Link from "next/link";
import {
  ChevronDoubleRightIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

type Props = {};

export default function UppNav({}: Props) {
  const connectWithMetamask = useMetamask();
  const disconnect = useDisconnect();
  const address = useAddress();

  return (
    <div className="max-w-6xl mx-auto p-2">
      <nav className="flex justify-between">
        <div className="flex items-center spacex-2 text-sm">
          {address ? (
            <button onClick={disconnect} className="walletBu">
              Hey Hey, {address.slice(0, 5) + "***" + address.slice(-4)}
            </button>
          ) : (
            <button onClick={connectWithMetamask} className="walletBu">
              Connect your wallet
            </button>
          )}
        </div>
        <div className="flex items-center space-x-2 px-2 md:px-5 py-2 border-1 flex-1 ml-4">
          <MagnifyingGlassIcon className="w-6 text-black" />
          <input
            className="flex-1"
            type="text"
            placeholder="Search Whatever, Whenever, Forever... "
          />
          {/* <button className="hidden sm:inline border-2 border-blue-600 px-5 md:px-10 py-2 text-blue-600 hover:bg-blue-600/50 hover:text-white cursor-pointer mr-2">
            Search
          </button> */}
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <Link href="/list-an-item">
            <button className="border-2 border-blue-600 px-5 md:px-10 py-2 text-blue-600 hover:bg-blue-600/50 hover:text-white cursor-pointer mr-2">
              List Item
            </button>
          </Link>
          <Link
            className="flex items-center hover:link"
            href="/add-to-inventory"
          >
            Add to your inventory
            <ChevronDoubleRightIcon className="ml-1 h-4" />
          </Link>
        </div>
      </nav>
      {/* <hr className="mt-2" /> */}
    </div>
  );
}

// const address = "0x1234567890abcdef";

// const button = address ? (
//   <button onClick={disconnect} className="connectWalletBtn">
//     Hi, {address.slice(0, 5) + '...' + address.slice(-4)}
//   </button>
// ) : (
//   <button onClick={connectWithMetamask} className="connectWalletBtn">
//     Connect your wallet
//   </button>
// );
