"use client";
import UppNav from "@/components/UppNav";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import {
  MediaRenderer,
  useActiveListings,
  useContract,
  useListing,
} from "@thirdweb-dev/react";
import React from "react";

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
  const { data: listings, isLoading: loadingListings } =
    useActiveListings(contract);

  const { data: listing, isLoading, error } = useListing(contract, listingId);

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
        <section>
          <div>
            <h1></h1>
            <p></p>
            <UserCircleIcon />
            <span />
          </div>
        </section>
      </main>
    </>
  );
}
