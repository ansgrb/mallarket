"use client";
import "./globals.css";
import { Inter } from "next/font/google";
import { ThirdwebProvider } from "@thirdweb-dev/react";
// import whatNetwortk from "@/utils/whatNetwortk";
import UppStNav from "@/components/UppStNav";
const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   title: "Mallarket",
//   description: "Powered by Agielar Lab",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ThirdwebProvider activeChain="mumbai">
        <body className={inter.className}>
          <UppStNav />
          {children}
        </body>
      </ThirdwebProvider>
    </html>
  );
}
