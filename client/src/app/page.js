"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ethers, BrowserProvider } from "ethers";
import abi from "../../../artifacts/contracts/NewMintNFT.sol/NewMintNFT.json";
import { useAccount } from "wagmi";
import axios from "axios";

const mintCost = ethers.parseEther("0.0001"); // Replace with the actual mint cost

const contractAddress = "0x6c86440984DA65bc6318711BeBCefc1d502dd46B";
const JWT =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIzYjFkN2RjNS0yYjgzLTQ5YzgtODE2Yy1kMDM4ZjhhZWVlOGEiLCJlbWFpbCI6Imhhcm9sZC5hbmR5QG91dGxvb2suY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6Ijc5MWM2MGVkZTRiMzVjMGRmYzQ2Iiwic2NvcGVkS2V5U2VjcmV0IjoiMTYxYzkxMzY1MjhiY2I0MWM5ODQ2MzU5Yzc5ZGM5ZDFmZjUwMzVmMzZmMzE3MmMwNWVhZjIwMTU1OGI5YTEwNyIsImlhdCI6MTY4OTc5NTUzMn0.TWygBZBfUwSqOezfbH9yJOFVgLiTUZ1CrlIFGcaUacQ";

export default function Home() {
  const { address, isConnected } = useAccount();
  const [mintAmount, setMintAmount] = useState(3); // Replace with the desired mint amount
  const [mintedCount, setMintedCount] = useState(0); // Replace with the desired mint amount
  const [whiteListed, setWhiteListed] = useState(false);
  const [myProof, setMyProof] = useState([]);
  const [contract, setContract] = useState(null);
  const [mintText, setMintText] = useState("");
  const [textWhiteListed, setTextWhiteListed] = useState("");
  const [mintCount, setMintCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
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
        mintNFTContract.on("NewNFTMinted", (from, tokenId, mintCnt) => {
          setTotalCount(parseInt(tokenId));
          setMintCount(parseInt(mintCnt));
          console.log("NewNFTMinted", from, tokenId, mintCnt);
          // setMintText(
          //   `NFT ${tokenId.toNumber()} is minted. Please check on <https://testnets.opensea.io/assets/sepolia/${contractAddress}/${tokenId.toNumber()}>`
          // );
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
      setMyProof(data.proof);
      return data.proof;
    } catch (error) {
      console.log("Error:", error);
      // Handle error scenario
    }
  };

  const update = async () => {
    const contract = await updateContract();
    const myProof = await getMyProof();
    let result = await contract.isWhiteListed(myProof);
    let totalSupply = await contract.totalSupply();
    let mintCnt = await contract.getmintCount();
    setWhiteListed(result);
    setTotalCount(parseInt(totalSupply));
    setMintCount(parseInt(mintCnt));
    setTextWhiteListed(`You are ${result ? "" : "not "}whitelisted.`);
  };

  useEffect(() => {
    update();
  }, [address]);

  useEffect(() => {
    // if (contract !== null)
    //   contract.on("NewNFTMinted", (from, tokenId) => {
    //     console.log("NewNFTMinted", from, tokenId.toNumber());
    //     setMintText(
    //       `NFT ${tokenId.toNumber()} is minted. Please check on <https://testnets.opensea.io/assets/sepolia/${contractAddress}/${tokenId.toNumber()}>`
    //     );
    //   });
  }, [contract]);

  const mint = async () => {
    try {
      setMintText(
        `Poping up the metamask to confirm the transaction. ${
          whiteListed
            ? "Freely Minting"
            : "Paying 0.0001 eth per one nft minting"
        }`
      );
      console.log(
        `Poping up the metamask to confirm the transaction. ${
          whiteListed
            ? "Freely Minting"
            : "Paying 0.0001 eth per one nft minting"
        }`
      );
      const mintTxn = await contract.mint(mintAmount, myProof, {
        value: mintCost * BigInt(whiteListed ? 0 : mintAmount),
      });
      setMintedCount(mintAmount);
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
      if (error.revert) {
        const errorMessage = error.revert.args.join();
        setMintTextandErase(errorMessage, 5000);
        console.log(errorMessage); // Output: Invalid mint amount!
      } else {
        console.error(error);
      }
    }
  };

  return (
    <div className="m-8">
      <div className="flex justify-evenly">
        <div>{textWhiteListed}</div>
        <div>Your NFTs: {mintCount} / 10</div>
        <div>Total NFTs: {totalCount} / 70</div>
      </div>
      <div>
        <input
          type="text"
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500 text-black"
          placeholder="Mint Amount"
          value={mintAmount}
          onChange={(event) => {
            setMintAmount(parseInt(event.target.value));
          }}
        />
        <button
          onClick={mint}
          className="m-4 px-6 py-2 text-white bg-blue-500 rounded-md shadow-md hover:bg-blue-600 transition-colors duration-300"
        >
          Mint
        </button>
        {mintedCount !== 0 && (
          <span>
            Lately Minted: {totalCount - mintedCount} ~ {totalCount - 1}
          </span>
        )}
      </div>
      <div>{mintText}</div>
    </div>
  );
}
