import React from "react";
import Link from "next/link";

// import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

type Props = {};

export default function Nav({}: Props) {
  return (
    <div className="flex justify-center p-3">
      <nav className="border p-5">
        <p className="text-4xl font-mono">mallarKET......🦆</p>
        <ul className="flex bg-white px-3 text-m font-bold text-black">
          <Link className="mr-6 hover:linkMain" href="/">
            Home
          </Link>
          <Link className="mr-6 hover:linkMain" href="/sell-digital-asset">
            Sell Digital Asset
          </Link>
          <Link className="mr-6 hover:linkMain" href="/my-digital-assets">
            My Digital Assets
          </Link>
          <Link className="mr-1 hover:linkMain" href="/creator-dashboard">
            Creator Dashboard
          </Link>
        </ul>
      </nav>
    </div>
  );
}

// <section className="flex items-center space-x-2 py-5">
//           <div className="w-16 h-16 sm:w-28 md:w-44 cursor-pointer flex-shrink-0"></div>
//           <div className="flex items-center space-x-2 px-2 md:px-5 py-2 border-black border-2 flex-1 ml-4">
//             <MagnifyingGlassIcon className="w-5 text-gray-400" />
//             <input
//               className="flex-1 outline-none"
//               type="text"
//               placeholder="Search for Anything..."
//             />
//           </div>

//           <button className="hidden sm:inline bg-blue-600 text-white px-5 md:px-10 py-2 border-2 border-blue-600">
//             Search
//           </button>
//           <Link href="/create">
//             <button className="border-2 border-blue-600 px-5 md:px-10 py-2 text-blue-600 hover:bg-blue-600/50 hover:text-white cursor-pointer ">
//               List Item
//             </button>
//           </Link>
//         </section>
