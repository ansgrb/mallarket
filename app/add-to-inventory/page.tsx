"use client";
import React, { FormEvent, useState } from "react";
import UppNav from "@/components/UppNav";
import { useContract, useAddress } from "@thirdweb-dev/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Props = {};

export default function AddToInventory({}: Props) {
  const address = useAddress();
  const router = useRouter();
  const [preview, setPreview] = useState("");
  const [image, setImage] = useState();
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_COLLECTION_CONTRACT,
    "nft-collection"
  );

  const addItem = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!contract || !address) return;

    if (!image) {
      return alert("Please select an image");
    }

    const target = e.target as typeof e.target & {
      name: { value: string };
      description: { value: string };
    };

    // const target = e.target;

    // if (target instanceof HTMLInputElement) {
    //   const name = target.name;
    //   const description = target.description;

    //   console.log(`The name of the event target is ${name}`);
    //   console.log(`The description of the event target is ${description}`);
    // }

    const metadata = {
      name: target.name.value,
      description: target.description.value,
      image: image, // image url or file
    };

    try {
      const tx = await contract.mintTo(address, metadata);

      const receipt = tx.receipt; // the transaction receipt
      const tokenId = tx.id; // the id of the NFT minted
      const nft = await tx.data();

      console.log(receipt, tokenId, nft);

      router.push("/main-page");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <UppNav />
      <main className="max-w-6xl mx-auto p-10 border">
        <h1 className="text-4xl font-bold">Add an Item to Marketplace</h1>
        <h2 className="text-xl font-semibold py-4">Item details</h2>
        <p className="pb-5">
          By adding an item to the marketplace, you're essentially Minting and
          NFT of the item into your wallet which we can then list for sale!
        </p>
        <div className="flex flex-col justify-center md:items-center md:flex-row md:space-x-5 pt-2">
          <Image
            className="border h-full w-full md:h-80 md:w-80 mb-4 object-contain"
            alt="uploadImage"
            src={preview || "/whiteSquare.png"}
            width={320}
            height={320}
          />
          <form
            onSubmit={addItem}
            className="flex flex-col flex-1 md:px-2 space-y-4"
          >
            <label className="font-light">Name of Item</label>
            <input
              type="text"
              className="formField"
              placeholder="Name of item..."
              name="name"
              id="name"
            />
            <label className="font-light">Description</label>
            <input
              type="text"
              className="formField"
              placeholder="Enter Description..."
              name="description"
              id="description"
            />
            <label className="font-light">Image of the Item</label>
            <input
              type="file"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setPreview(URL.createObjectURL(e.target.files[0]));
                  setImage(e.target.files[0]);
                }
              }}
            />
            <button
              type="submit"
              className="bg-cyan-600 font-bold text-white rounded-full py-4 px-10 w-56 hover:drop-shadow-xl cursor-pointer transition-all duration-500"
            >
              Add Item
            </button>
          </form>
        </div>
      </main>
    </>
  );
}