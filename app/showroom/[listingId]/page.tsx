"use client";
import UppNav from "@/components/UppNav";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import {
  ListingType,
  MediaRenderer,
  useActiveListings,
  useContract,
  useListing,
  useSwitchChain,
  useNetworkMismatch,
  useMakeBid,
  useOffers,
  useMakeOffer,
  useBuyNow,
  useAddress,
  useAcceptDirectListingOffer,
  ChainId,
} from "@thirdweb-dev/react";
import { useRouter } from "next/navigation";
// import { Router } from "next/router";
import React, { useEffect, useState } from "react";
import Countdown from "react-countdown";

type ShowroomProps = {
  params: {
    listingId: string;
  };
};

export default function ShowroomListings({
  params: { listingId },
}: ShowroomProps): React.JSX.Element {
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_MALLARKET_CONTRACT,
    "marketplace"
  );
  const networkMismatch = useNetworkMismatch();
  // const [, switchNetwork] = useNetwork();
  const switchChain = useSwitchChain();

  const router = useRouter();

  const { mutate: buyNow } = useBuyNow(contract);

  const [minimumNextBid, setMinimumNextBid] = useState<{
    displayValue: string;
    symbol: string;
  }>();
  const { data: listings, isLoading: loadingListings } =
    useActiveListings(contract);

  const { data: listing, isLoading, error } = useListing(contract, listingId);
  const [bidAmount, setBidAmount] = useState(" ");

  useEffect(() => {
    if (!listingId || !contract || !listing) return;

    if (listing.type === ListingType.Auction) {
      fetchMinNextBid();
    }
  }, [listingId, listing, contract]);

  const fetchMinNextBid = async () => {
    if (!listingId || !contract) return;

    const { displayValue, symbol } = await contract.auction.getMinimumNextBid(
      listingId
    );

    setMinimumNextBid({
      displayValue: displayValue,
      symbol: symbol,
    });
  };

  const forPlaceholder = () => {
    if (!listing) return;

    if (listing.type === ListingType.Direct) {
      return "Enter Offer Amount";
    } else if (listing.type === ListingType.Auction) {
      return Number(minimumNextBid?.displayValue) === 0
        ? "Enter Bid Amount"
        : `${minimumNextBid?.displayValue} ${minimumNextBid?.symbol} or higer`;
    }
  };

  if (isLoading) {
    return (
      <>
        <UppNav />
        <div className="text-center animate-bounce">
          <p>Loading...</p>
        </div>
      </>
    );
  } else if (!listing) {
    return <div>Error: Nothing here!</div>;
  }

  const buyItem = async () => {
    if (networkMismatch) {
      switchChain && switchChain(ChainId.Mumbai);
      return;
    }
    if (!listing || !contract || !listingId) return;
    await buyNow(
      {
        id: listingId,
        buyAmount: 1,
        type: listing.type,
      },
      {
        onSuccess(data, variables, context) {
          alert("NICE, THAT WAS A SUCCESS PURCHACE!");
          console.log("NICE, THAT WAS A SUCCESS", data, variables, context);
          router.replace("/main-page");
        },
        onError(data, variables, context) {
          alert("SHAME, THAT WAS A MISS");
          console.log("ERROR", error, data, variables, context);
          router.replace("/main-page");
        },
      }
    );
  };

  const creaBidOrOffer = async () => {
    try {
      if (networkMismatch) {
        switchChain && switchChain(ChainId.Mumbai);
        return;
      }
      if (listing?.type === ListingType.Direct) {
      }
      if (listing?.type === ListingType.Auction) {
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <UppNav />
      <main
        className="max-w-6xl mx-auto p-2 flex flex-col lg:flex-row items-center 
      justify-center md:items-start space-y-10 space-x-12 pr-10"
      >
        <div className="p-10 border mx-auto lg:mx-0 w-full ml-4 md:max-w-lg">
          <MediaRenderer src={listing.asset.image} />
        </div>
        <section className="flex-1 space-y-5 pb-20 lg:pb-0">
          <div>
            <h1 className="text-xl font-bold">{listing.asset.name}</h1>
            <p className="text-gray-700">{listing.asset.description}</p>
            <p className="flex items-center text-xs sm:text-base">
              <UserCircleIcon className="h-6" />
              <span className="font-bold pr-3">Seller: </span>
              {listing.sellerAddress}
            </p>
          </div>
          <div className="grid grid-cols-2 items-center py-2">
            <p className="font-bold">Listing Type:</p>
            <p>
              {listing.type === ListingType.Direct
                ? "Direct Listing"
                : "Auction Listing"}
            </p>
            <p className="font-bold">Buy it Now Price:</p>
            <p className="text-4xl font-bold">
              {listing.buyoutCurrencyValuePerToken.displayValue}{" "}
              {listing.buyoutCurrencyValuePerToken.symbol}
            </p>
            <button
              onClick={buyItem}
              className="col-start-2 mt-2 rounded-full bg-cyan-700
             text-white font-bold w-44 py-4 px-10"
            >
              Buy Now
            </button>
          </div>

          <div className="grid grid-cols-2 space-y-2 items-center justify-end">
            <hr className="col-span-2 " />

            <p className="col-span-2 font-bold">
              {listing.type === ListingType.Direct
                ? "Make an Offer"
                : "Bid on this Auction"}
            </p>

            {listing.type === ListingType.Auction && (
              <>
                <p>Current Minimum Bid:</p>
                <p className="font-bold">
                  {minimumNextBid?.displayValue} {minimumNextBid?.symbol}
                </p>
                <p>Time Remaining: </p>
                <Countdown
                  date={Number(listing.endTimeInEpochSeconds.toString()) * 1000}
                />
              </>
            )}

            <input
              onChange={(e) => setBidAmount(e.target.value)}
              className="border p-2 rounded-lg mr-5 outline-red-400"
              type="text"
              placeholder={forPlaceholder()}
            />
            <button
              onClick={creaBidOrOffer}
              className="col-start-2 mt-2 rounded-full bg-red-400
             text-white font-bold w-44 py-4 px-10"
            >
              {listing.type === ListingType.Direct ? "Offer" : "Bid"}
            </button>
          </div>
        </section>
      </main>
    </>
  );
}
