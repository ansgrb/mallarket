"use client";
import Link from "next/link";
import React from "react";

type Props = {};

export default function UppStNav({}: Props) {
  return (
    <nav className="sticky top-0 z-50 bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center py-2">
          <Link href="/" className="text-black text-4xl font-mono">
            mallarKET
          </Link>
          {/* <div className="block lg:hidden">
          </div> */}
        </div>
      </div>
    </nav>
  );
}
