"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ethers, BrowserProvider } from "ethers";
import abi from "../../../artifacts/contracts/NewMintNFT.sol/NewMintNFT.json";
import { useAccount } from "wagmi";
import axios from "axios";

// Set the mint amount and mint cost
const mintAmount = 10; // Replace with the desired mint amount
const mintCost = ethers.parseEther("0.0001"); // Replace with the actual mint cost

const contractAddress = "0x79a6ca091A101d4Ba747474795b295ADceA6242d";
const JWT =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIzYjFkN2RjNS0yYjgzLTQ5YzgtODE2Yy1kMDM4ZjhhZWVlOGEiLCJlbWFpbCI6Imhhcm9sZC5hbmR5QG91dGxvb2suY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6Ijc5MWM2MGVkZTRiMzVjMGRmYzQ2Iiwic2NvcGVkS2V5U2VjcmV0IjoiMTYxYzkxMzY1MjhiY2I0MWM5ODQ2MzU5Yzc5ZGM5ZDFmZjUwMzVmMzZmMzE3MmMwNWVhZjIwMTU1OGI5YTEwNyIsImlhdCI6MTY4OTc5NTUzMn0.TWygBZBfUwSqOezfbH9yJOFVgLiTUZ1CrlIFGcaUacQ";

export default function Home() {
  const { address, isConnected } = useAccount();
  const [contract, setContract] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
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

  // const mint = async (tokenURI) => {
  //   try {
  //     setMintText("Poping up the metamask to confirm the gas fee");
  //     console.log("Poping up the metamask to confirm the gas fee");
  //     const mintTxn = await contract.mintNFT(tokenURI);
  //     setMintText("Minting...please wait.");
  //     console.log("Minting...please wait.");
  //     await mintTxn.wait();
  //     setMintText(
  //       `Mint function called successfully.\nYou can check on https://sepolia.etherscan.io/tx/${mintTxn.hash}`
  //     );
  //     console.log(
  //       `Mint function called successfully. You can check on https://sepolia.etherscan.io/tx/${mintTxn.hash}`
  //     );
  //     setTimeout(() => {
  //       setMintText("");
  //     }, 5000);
  //   } catch (error) {
  //     setMintText("Error occured while minting");
  //     console.log(error);
  //     setTimeout(() => {
  //       setMintText("");
  //     }, 5000);
  //   }
  // };

  // const handleImageChange = (event) => {
  //   const file = event.target.files[0];
  //   setSelectedImage(file);
  // };

  // const uploadImage = async (selectedFile) => {
  //   const formData = new FormData();

  //   formData.append("file", selectedFile);

  //   const metadata = JSON.stringify({
  //     name: name,
  //   });
  //   formData.append("pinataMetadata", metadata);

  //   const options = JSON.stringify({
  //     cidVersion: 0,
  //   });
  //   formData.append("pinataOptions", options);

  //   try {
  //     const res = await axios.post(
  //       "https://api.pinata.cloud/pinning/pinFileToIPFS",
  //       formData,
  //       {
  //         maxBodyLength: "Infinity",
  //         headers: {
  //           "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
  //           Authorization: JWT,
  //         },
  //       }
  //     );
  //     return res.data.IpfsHash;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const uploadJSON = async (imageIpfsHash) => {
  //   const data = JSON.stringify({
  //     pinataOptions: {
  //       cidVersion: 1,
  //     },
  //     pinataMetadata: {
  //       name: name,
  //     },
  //     pinataContent: {
  //       name: name,
  //       description: description,
  //       image: `ipfs://${imageIpfsHash}`,
  //     },
  //   });

  //   const config = {
  //     method: "post",
  //     url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: JWT,
  //     },
  //     data: data,
  //   };

  //   const res = await axios(config);

  //   console.log("json", res.data);
  //   return res.data.IpfsHash;
  // };

  // const uploadAndMint = async (selectedImage) => {
  //   const imageIpfsHash = await uploadImage(selectedImage);
  //   console.log(imageIpfsHash);
  //   const jsonIpfsHash = await uploadJSON(imageIpfsHash);
  //   console.log(jsonIpfsHash);
  //   await mint(`ipfs://${jsonIpfsHash}`);
  // };

  // const handleUpload = () => {
  //   if (selectedImage) {
  //     // Implement your logic for uploading the image here
  //     setMintText("Uploading image...");
  //     console.log("Uploading image:", selectedImage);
  //     uploadAndMint(selectedImage);
  //   }
  // };

  const mint = async () => {
    try {
      setMintText("Poping up the metamask to confirm the gas fee");
      console.log(
        "Poping up the metamask to confirm the gas fee",
        typeof mintCost,
        typeof mintAmount
      );
      const mintTxn = await contract.mint(mintAmount, {
        value: mintCost * BigInt(mintAmount),
      });
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

  return (
    <div className="m-8">
      {/* <input
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
      </label> */}
      <button
        onClick={mint}
        className="mt-4 px-6 py-2 text-white bg-blue-500 rounded-md shadow-md hover:bg-blue-600 transition-colors duration-300"
      >
        Mint
      </button>
      {/* <div className="py-4">
        <input
          type="text"
          className="w-1/4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500 text-black mr-2"
          placeholder="NAME"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
          }}
        />

        <input
          type="text"
          className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500 text-black"
          placeholder="Description"
          value={description}
          onChange={(event) => {
            setDescription(event.target.value);
          }}
        />
      </div> */}
      <div>{mintText}</div>
    </div>
  );
}
