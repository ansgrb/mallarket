"use client";
import React, { FormEvent, useState } from "react";
import UppNav from "@/components/UppNav";
import whatNetwortk from "@/utils/whatNetwortk";
import {
  useAddress,
  useContract,
  MediaRenderer,
  useSwitchChain,
  useChain,
  useNetworkMismatch,
  useOwnedNFTs,
  useCreateAuctionListing,
  useCreateDirectListing,
} from "@thirdweb-dev/react";
import {
  NFT,
  NATIVE_TOKENS,
  NATIVE_TOKEN_ADDRESS,
  ChainId,
} from "@thirdweb-dev/sdk";
import { useRouter } from "next/navigation";

type Props = {};

export default function ListAnItem({}: Props) {
  const router = useRouter();
  const address = useAddress();
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_MALLARKET_CONTRACT,
    "marketplace"
  );
  const [selectedItem, setSelectedItem] = useState<NFT>();
  const { contract: collectionContract } = useContract(
    process.env.NEXT_PUBLIC_COLLECTION_CONTRACT,
    "nft-collection"
  );

  const ownedItems = useOwnedNFTs(collectionContract, address);

  const networkMismatch = useNetworkMismatch();
  // const [, switchNetwork] = useNetwork();
  const switchChain = useSwitchChain();

  const {
    mutate: createDirectListing,
    isLoading,
    error,
  } = useCreateDirectListing(contract);
  const {
    mutate: createAuctionListing,
    isLoading: isLoadingDirect,
    error: errorDirect,
  } = useCreateAuctionListing(contract);

  const makePlace = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (networkMismatch) {
      switchChain && switchChain(ChainId.Mumbai);
      return;
    }
    if (!selectedItem) return;

    const target = e.target as typeof e.target & {
      elements: { listingType: { value: string }; price: { value: string } };
    };

    const { listingType, price } = target.elements;

    if (listingType.value === "direct") {
      createDirectListing(
        {
          assetContractAddress: process.env.NEXT_PUBLIC_COLLECTION_CONTRACT!,
          tokenId: selectedItem.metadata.id,
          currencyContractAddress: NATIVE_TOKEN_ADDRESS,
          listingDurationInSeconds: 60 * 60 * 24 * 7,
          quantity: 1,
          buyoutPricePerToken: price.value,
          startTimestamp: new Date(),
        },
        {
          onSuccess(data, variables, context) {
            console.log("SUCCESS: ", data, variables, context);
            router.push("/main-page");
          },
          onError(data, variables, context) {
            console.log("ERROR: ", data, variables, context);
          },
        }
      );
    }

    if (listingType.value === "auction") {
      createAuctionListing(
        {
          assetContractAddress: process.env.NEXT_PUBLIC_COLLECTION_CONTRACT!,
          buyoutPricePerToken: price.value,
          tokenId: selectedItem.metadata.id,
          currencyContractAddress: NATIVE_TOKEN_ADDRESS,
          startTimestamp: new Date(),
          listingDurationInSeconds: 60 * 60 * 24 * 7,
          quantity: 1,
          reservePricePerToken: 0,
        },
        {
          onSuccess(data, variables, context) {
            console.log("SUCCESS: ", data, variables, context);
            router.push("/main-page");
          },
          onError(data, variables, context) {
            console.log("ERROR: ", data, variables, context);
          },
        }
      );
    }
  };
  return (
    <>
      <UppNav />
      <main className="max-w-6xl mx-auto p-10 pt-2">
        <h1 className="text-4xl font-bold">List an Item</h1>
        <h2 className="text-xl font-semibold pt-5">
          Select an Item to list it in mallarKET!
        </h2>
        <hr className="mb-5 mt-2" />
        <p> Below you will find your own items from your wallet account.</p>

        <div className="flex overflow-x-scroll space-x-2 p-4">
          {ownedItems?.data?.map((item) => (
            <div
              key={item.metadata.id}
              onClick={() => setSelectedItem(item)}
              className={`flex flex-col space-y-2 card min-w-fit 
              border-2 bg-gray-100 ${
                item.metadata.id === selectedItem?.metadata.id
                  ? "border-black"
                  : "border-transparent"
              }`}
            >
              <MediaRenderer
                className="h-48 rounded-lg"
                src={item.metadata.image}
              />
              <p className="text-lg font-bold truncate">{item.metadata.name}</p>
              <p className="text-xs truncate">{item.metadata.description}</p>
            </div>
          ))}
        </div>
        {selectedItem && (
          <form onSubmit={makePlace}>
            <div className="flex flex-col p-10">
              <div className="grid grid-cols-2 gap-5">
                <label className="border-r font-light">
                  Make A Direct Listing
                </label>
                <input
                  className="ml-auto h-10 w-10"
                  type="radio"
                  name="listingType"
                  value="direct"
                />
                <label className="border-r font-light">Make An Auction</label>
                <input
                  className="ml-auto h-10 w-10"
                  type="radio"
                  name="listingType"
                  value="auction"
                />

                <label className="border-r font-light">Price</label>
                <input
                  className="bg-gray-100 p-5"
                  type="text"
                  name="price"
                  placeholder="00.069"
                />
              </div>
              <button
                type="submit"
                className="bg-cyan-700 text-white rounded-lf p-4 mt-8"
              >
                Place An Item
              </button>
            </div>
          </form>
        )}
      </main>
    </>
  );
}
