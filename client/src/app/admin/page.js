"use client";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { ethers, BrowserProvider } from "ethers";
import abi from "../../../../artifacts/contracts/NewMintNFT.sol/NewMintNFT.json";
const contractAddress = "0x53c033d9307c1F675177b3fc64d40ce906506c4a";

export default function Home() {
  const { address, isConnected } = useAccount();
  const [contacts, setContacts] = useState([]);
  const [text, setText] = useState("");
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const getContacts = async () => {
      try {
        const response = await fetch("/api/list", {
          method: "GET",
        });

        const data = await response.json();
        setContacts(data.contacts);
      } catch (error) {
        console.log("Error:", error);
        // Handle error scenario
      }
    };
    getContacts();
  }, []);

  const updateContract = async () => {
    // build the contract that can be used in multiple functions
    console.log("contractAddress", contractAddress);
    try {
      const { ethereum } = window;
      if (ethereum) {
        const web3Provider = new ethers.BrowserProvider(ethereum);
        const signer = await web3Provider.getSigner();
        // const provider = new ethers.providers.Web3Provider(ethereum);
        // const signer = provider.getSigner();
        const whiteListContract = new ethers.Contract(
          contractAddress,
          abi.abi,
          signer
        );
        // console.log("whiteListContract:", whiteListContract);
        setContract(whiteListContract);
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

  const update = async () => {
    try {
      const response = await fetch("/api/list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contacts: contacts }),
      });

      const rootHash = await response.json();
      console.log("roothash", rootHash);
      try {
        setText("Poping up the metamask to confirm the gas fee");
        console.log("Poping up the metamask to confirm the gas fee");
        const saveTxn = await contract.saveWhiteList(rootHash);
        setText("Saving...please wait.");
        console.log("Saving...please wait.");
        await saveTxn.wait();
        setText(
          `Save function called successfully.\nYou can check on https://sepolia.etherscan.io/tx/${saveTxn.hash}`
        );
        console.log(
          `Save function called successfully.\nYou can check on https://sepolia.etherscan.io/tx/${saveTxn.hash}`
        );
        setTimeout(() => {
          setText("");
        }, 5000);
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log("Error:", error);
      // Handle error scenarioW
    }
  };

  if (address !== "0x47039C514D7d06DA97a1B6c61931dAF710Aa50bF")
    return <div>You have no permission</div>;

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div>{text}</div>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600 mb-4"
        onClick={update}
      >
        Update
      </button>
      <div className="mb-4 w-2/5 px-4" data-te-input-wrapper-init>
        <textarea
          className="border-2 peer block min-h-[auto] w-full rounded border-1 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
          id="exampleFormControlTextarea1"
          rows="22"
          placeholder="Your message"
          value={contacts.join("\n")}
          onChange={(e) => {
            setContacts(e.target.value.split("\n"));
            console.log(contacts);
          }}
        ></textarea>
      </div>
    </div>
  );
}
