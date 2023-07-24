const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const contractAddress = "0xF0246FAE84850130DC846994Bd6D4d4B4279490F";

let data = {};
let curId = 0;

const main = async () => {
  let baseContract = await hre.ethers.getContractFactory("Students");
  let contract = baseContract.attach(contractAddress);

  console.log(contract.address);

  contract.on("Added", (name, age) => {
    console.log("Added", name, age);
    data[curId] = { name: name, age: age };
    curId++;
  });
  contract.on("Updated", (id, name, age) => {
    console.log("Updated", id, name, age);
    data[id] = { name: name, age: age };
  });
  contract.on("Removed", (id) => {
    console.log("Removed", id);
    delete data[id];
  });
};
main();

app.get("/api", (req, res) => {
  // Replace this JSON message with your desired response
  const message = {
    message: "Hello, this is a simple GET API response!",
  };
  // Send the JSON response
  res.json(data);
});

app.listen(port);
console.log("listening on", port);
