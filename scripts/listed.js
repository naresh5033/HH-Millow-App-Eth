const { ethers, network, deployments } = require("hardhat");
const { moveBlocks } = require("../utils/move-blocks");

const PRICE = ethers.utils.parseEther("0.1");
const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

//here we're only minting not listing this time
const buyer = "0x6353112CDbF33f2A3c86c891f88613C1963beD39";
//const seller = "0xa7Ffeb3d4E0f6d68946843342D54bfcb43Cb84AA";
//const [seller, inspector, lender] = await ethers.getSigners();
async function listed() {
  const [seller] = await ethers.getSigners();
  const realEstate = await ethers.getContract("RealEstate");
  const escrow = await ethers.getContract("Escrow");
  //console.log(seller.address);
  console.log("Listing ...");
  //for (let i = 0; i < 3; i++) {
  // Approve properties...
  const approveTx = await realEstate
    .connect(seller)
    .approve(escrow.address, 16);
  console.log("approved");
  //const approveTxReceipt = await approveTx.wait(1);

  // Listing properties...
  const listingTx = await escrow.connect(seller).list(16, buyer, 15, 5);
  //const listingTxReceipt = await listingTx.wait(1);
  console.log("successfully listed");

  /*transaction = await escrow
    .connect(seller)
    .list(2, buyer.address, tokens(15), tokens(5));
  await transaction.wait();

  transaction = await escrow
    .connect(seller)
    .list(3, buyer.address, tokens(10), tokens(5));
  await transaction.wait();*/

  console.log(`Finished.`);

  if (network.config.chainId == 31337) {
    // Moralis has a hard time if you move more than 1 block!
    await moveBlocks(2, (sleepAmount = 1000));
  }
}

listed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
