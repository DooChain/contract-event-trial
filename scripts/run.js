const main = async () => {
  const mintNFT = await hre.ethers.deployContract("MintNFT");

  await mintNFT.waitForDeployment();

  console.log(`MintNFT deployed to ${mintNFT.target}`);

  const mintTxn = await mintNFT.mintNFT(
    "ipfs://QmeNtvidkTn2qqA4ahAoo8KTrXcE3MMj9UPSa3qPdPkS77"
  );
  await mintTxn.wait();
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
