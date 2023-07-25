const contractAddress = "0xF0246FAE84850130DC846994Bd6D4d4B4279490F"; // Sepolia
// const contractAddress = "0x40D1F2Ae469CBE4b0Ee0C8C1EBD581d5800E9acB"; // Arbitrum Goerli
const main = async () => {
  // const provider = new ethers.providers.JsonRpcProvider(
  //   process.env.STAGING_QUICKNODE_KEY
  // );
  // const signer = hre.ethers.getSigner(process.env.PRIVATE_KEY, provider);
  let baseContract = await hre.ethers.getContractFactory("Students");
  let contract = baseContract.attach(contractAddress);

  console.log(contract.address);

  contract.on("Added", (name, age) => {
    console.log("Added", name, age);
  });
  contract.on("Updated", (id, name, age) => {
    console.log("Updated", id, name, age);
  });
  contract.on("Removed", (id) => {
    console.log("Removed", id);
  });

  const addTxn1 = await contract.add("stu1", 20);
  await addTxn1.wait();
  console.log(addTxn1.hash);

  const addTxn2 = await contract.add("stu2", 22);
  await addTxn2.wait();
  console.log(addTxn2.hash);

  const updateTxn = await contract.update(1, "stu2Update", 23);
  await updateTxn.wait();
  console.log(updateTxn.hash);

  const removeTxn = await contract.remove(0);
  await removeTxn.wait();
  console.log(removeTxn.hash);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
