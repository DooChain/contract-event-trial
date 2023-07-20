"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ethers, BrowserProvider } from "ethers";
import abi from "../../../artifacts/contracts/NewMintNFT.sol/NewMintNFT.json";
import { useAccount } from "wagmi";
import axios from "axios";

// Set the mint amount and mint cost
const mintAmount = 5; // Replace with the desired mint amount

const contractAddress = "0xACa531C4291011C3C7A97E0C165682CfbE2c7EF7";
const JWT =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIzYjFkN2RjNS0yYjgzLTQ5YzgtODE2Yy1kMDM4ZjhhZWVlOGEiLCJlbWFpbCI6Imhhcm9sZC5hbmR5QG91dGxvb2suY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6Ijc5MWM2MGVkZTRiMzVjMGRmYzQ2Iiwic2NvcGVkS2V5U2VjcmV0IjoiMTYxYzkxMzY1MjhiY2I0MWM5ODQ2MzU5Yzc5ZGM5ZDFmZjUwMzVmMzZmMzE3MmMwNWVhZjIwMTU1OGI5YTEwNyIsImlhdCI6MTY4OTc5NTUzMn0.TWygBZBfUwSqOezfbH9yJOFVgLiTUZ1CrlIFGcaUacQ";

export default function Home() {
  const { address, isConnected } = useAccount();
  const [mintCost, setMintCost] = useState(ethers.parseEther("0.0001")); // Replace with the actual mint cost
  const [whiteListed, setWhiteListed] = useState(false);
  const [contract, setContract] = useState(null);
  const [mintText, setMintText] = useState("");
  const setMintTextandErase = async (text = "", timeout = 6000) => {
    setMintText(text);
    setTimeout(() => {
      setMintText("");
    }, timeout);
  };

  const updateContract = async () => {
    // build the contract that can be used in multiple functions
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
        mintNFTContract.on("NewNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber());
          setMintText(
            `NFT ${tokenId.toNumber()} is minted. Please check on <https://testnets.opensea.io/assets/sepolia/${contractAddress}/${tokenId.toNumber()}>`
          );
        });
        setContract(mintNFTContract);
        return mintNFTContract;
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log("ERROR:", error);
    }
  };

  const getMyProof = async () => {
    // fetch own proof from the backend
    try {
      const response = await fetch("/api/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address: address }),
      });

      const data = await response.json();
      return data.proof;
    } catch (error) {
      console.log("Error:", error);
      // Handle error scenario
    }
  };

  const updateMintCost = async () => {
    const contract = await updateContract();
    const myProof = await getMyProof();
    let result = await contract.isWhiteListed(myProof);
    setWhiteListed(result);
    console.log(
      `You are ${result ? "" : "not "}whitelisted.\nYou need to pay 0.000${
        result
          ? "1 eth (half amount of normal)"
          : "2 eth (twice than if whitelisted)"
      } per one nft minting.`
    );
    setMintCost(ethers.parseEther(result ? "0.0001" : "0.0002"));
    setMintTextandErase(
      `You are ${result ? "" : "not "}whitelisted.\nYou need to pay 0.000${
        result
          ? "1 eth (half amount of normal)"
          : "2 eth (twice than if whitelisted)"
      } per one nft minting.`,
      8000
    );
  };

  useEffect(() => {
    updateMintCost();
  }, [address]);

  const mint = async () => {
    try {
      setMintText(
        `Poping up the metamask to confirm the transaction. Paying 0.000${
          whiteListed ? "1 eth" : "2 eth"
        } per one nft minting.`
      );
      console.log(
        `Poping up the metamask to confirm the transaction. Paying 0.000${
          whiteListed ? "1 eth" : "2 eth"
        } per one nft minting.`
      );
      const mintTxn = await contract.mint(mintAmount, mintCost, {
        value: mintCost * BigInt(mintAmount),
      });
      setMintText("Minting started...please wait.");
      console.log("Minting...please wait.");
      await mintTxn.wait();
      setMintTextandErase(
        `Mint function called successfully.\nYou can check on https://sepolia.etherscan.io/tx/${mintTxn.hash}`,
        6000
      );
      console.log(
        `Mint function called successfully. You can check on https://sepolia.etherscan.io/tx/${mintTxn.hash}`
      );
    } catch (error) {
      setMintTextandErase("Error occured while minting", 5000);
      console.log(error);
    }
  };

  return (
    <div className="m-8">
      <button
        onClick={mint}
        className="mt-4 px-6 py-2 text-white bg-blue-500 rounded-md shadow-md hover:bg-blue-600 transition-colors duration-300"
      >
        Mint
      </button>
      <div>{mintText}</div>
    </div>
  );
}
