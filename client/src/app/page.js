"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ethers, BrowserProvider } from "ethers";
import abi from "../../../artifacts/contracts/MintNFT.sol/MintNFT.json";
import { useAccount } from "wagmi";

const contractAddress = "0xd6D7F1069c43506F3e29B449201C639b155885a3";

export default function Home() {
  const { address, isConnected } = useAccount();
  const [contract, setContract] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [mintText, setMintText] = useState("");

  const updateContract = async () => {
    // build the contract that can be used in multiple functions
    console.log("contractAddress", contractAddress);
    try {
      const { ethereum } = window;
      if (ethereum) {
        const web3Provider = new ethers.BrowserProvider(ethereum);
        const signer = await web3Provider.getSigner();
        const mintNFTContract = new ethers.Contract(
          contractAddress,
          abi.abi,
          signer
        );
        setContract(mintNFTContract);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log("ERROR:", error);
    }
  };

  useEffect(() => {
    updateContract();
  }, [address]);

  const mint = async () => {
    try {
      setMintText("Poping up the metamask to confirm the gas fee");
      console.log("Poping up the metamask to confirm the gas fee");
      const mintTxn = await contract.mintNFT(
        "ipfs://QmeNtvidkTn2qqA4ahAoo8KTrXcE3MMj9UPSa3qPdPkS77"
      );
      setMintText("Minting...please wait.");
      console.log("Minting...please wait.");
      await mintTxn.wait();
      setMintText(
        `Mint function called successfully.\nYou can check on https://sepolia.etherscan.io/tx/${mintTxn.hash}`
      );
      console.log(
        `Mint function called successfully. You can check on https://sepolia.etherscan.io/tx/${mintTxn.hash}`
      );
      setTimeout(() => {
        setMintText("");
      }, 5000);
    } catch (error) {
      setMintText("Error occured while minting");
      console.log(error);
      setTimeout(() => {
        setMintText("");
      }, 5000);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
  };

  const handleUpload = () => {
    mint();
    if (selectedImage) {
      // Implement your logic for uploading the image here
      console.log("Uploading image:", selectedImage);
    }
  };

  return (
    <div className="m-8">
      <input
        type="file"
        className="hidden"
        id="image-input"
        accept="image/*"
        onChange={handleImageChange}
      />
      <label
        htmlFor="image-input"
        className="flex items-center justify-center w-40 h-40 bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300 transition-colors duration-300"
      >
        {selectedImage ? (
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Selected Image"
            className="w-full h-full object-cover rounded-md"
          />
        ) : (
          <span className="text-gray-500 text-lg font-semibold">
            Select Image
          </span>
        )}
      </label>
      <button
        onClick={handleUpload}
        className="mt-4 px-6 py-2 text-white bg-blue-500 rounded-md shadow-md hover:bg-blue-600 transition-colors duration-300"
      >
        Mint
      </button>
      <div>{mintText}</div>
    </div>
  );
}
