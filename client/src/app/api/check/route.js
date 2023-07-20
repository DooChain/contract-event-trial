import { NextResponse } from "next/server";
import keccak256 from "keccak256";
import { tree } from "../MerkleTree";

//  Utility Function to Convert From Buffer to Hex
const buf2Hex = (x) => "0x" + x.toString("hex");

export async function POST(request) {
  try {
    const json = await request.json();
    // console.log(json.address);

    const leaf = keccak256(json.address);

    const proof = tree.getProof(leaf);

    let tempData = [];
    proof.map((x) => tempData.push(buf2Hex(x.data)));

    // console.log(tempData);

    let json_response = {
      status: "success",
      proof: tempData,
    };
    return new NextResponse(JSON.stringify(json_response), {
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
