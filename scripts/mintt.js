const { ethers, network } = require("hardhat");
const { moveBlocks } = require("../utils/move-blocks");

const PRICE = ethers.utils.parseEther("0.1");

//here we're only minting not listing this time
//const seller = "0x6353112CDbF33f2A3c86c891f88613C1963beD39"

async function mintt() {
  const [seller] = await ethers.getSigners();
  const realEstate = await ethers.getContract("RealEstate");

  console.log("Minting NFT...");
  //console.log(realEstate);
  //const mintTx = await realEstate.mintNft()
  // const seller = "0x6353112CDbF33f2A3c86c891f88613C1963beD39"
  //for (let i = 0; i < 3; i++) {
  const mintTx = await realEstate
    .connect(seller)
    .mint(
      `https://ipfs.io/ipfs/QmQVcpsjrA6cr1iJjZAodYwmPekYgbnXGo4DFubJiLc2EB/3.json`
    );
  const mintTxReceipt = await mintTx.wait(1);
  console.log(`Minted tokenId 3 from contract: ${realEstate.address}`);
  if (network.config.chainId == 31337) {
    // Moralis has a hard time if you move more than 1 block!
    await moveBlocks(2, (sleepAmount = 1000));
  }
}
mintt()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
