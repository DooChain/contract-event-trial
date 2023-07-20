import { NextResponse } from "next/server";
import keccak256 from "keccak256";
const { default: MerkleTree } = require("merkletreejs");
import fs from "fs";

//  Utility Function to Convert From Buffer to Hex
const buf2Hex = (x) => "0x" + x.toString("hex");

export async function GET(request) {
  const data = fs.readFileSync("../data.json", "utf8");
  // Parse the JSON data
  const jsonData = await JSON.parse(data);

  // Access the whiteList array
  const json_response = {
    status: "success",
    contacts: jsonData,
  };
  return NextResponse.json(json_response);
}

export async function POST(request) {
  try {
    const json = await request.json();
    // console.log(json.contacts);

    fs.writeFileSync("../data.json", JSON.stringify(json.contacts));

    //  Hashing All Leaf Individual
    const leaves = await json.contacts.map((leaf) => keccak256(leaf));

    // Constructing Merkle Tree
    const tree = new MerkleTree(leaves, keccak256, {
      sortPairs: true,
    });

    // Get Root of Merkle Tree
    const rootHash = buf2Hex(tree.getRoot());
    console.log(`Here is Root Hash: ${rootHash}`);

    return new NextResponse(JSON.stringify(rootHash), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    let error_response = {
      status: "error",
      message: error.message,
    };
    return new NextResponse(JSON.stringify(error_response), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
