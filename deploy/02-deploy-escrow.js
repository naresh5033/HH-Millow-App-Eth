const { network, ethers } = require("hardhat");
//const { ethers } = require("ethers");
const { inspect } = require("util");
const {
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
const { url } = require("inspector");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;

  const { seller } = await getNamedAccounts();
  //const seller = deployer;
  const waitBlockConfirmations = developmentChains.includes(network.name)
    ? 1
    : VERIFICATION_BLOCK_CONFIRMATIONS;

  log("----------------------------------------------------");
  const realEstateAddress = "0x1E3b058E906931A654d18fC96Ac9B07a7667599c";
  //const seller = "0x6353112CDbF33f2A3c86c891f88613C1963beD39";
  const inspectorAddress = "0x10c8B70284BA45134e0BAa7fCcc36D07B4290EDa";
  const lenderAddress = "0x695960BCdCa8B55AEc37B64500Bd64B4BBFe4fFf";
  //const [buyer, seller, inspector, lender] = await ethers.getSigners();

  const args = [realEstateAddress, seller, inspectorAddress, lenderAddress];
  const escrow = await deploy("Escrow", {
    from: seller,
    args: args,
    log: true,
    waitConfirmations: waitBlockConfirmations,
  });
  //await escrow.deployed();

  console.log(`Deployed Escrow Contract at: ${escrow.address}`);
  console.log(`Listing 3 properties...\n`);
  const realEstate = await ethers.getContractFactory("RealEstate");
  for (let i = 0; i < 3; i++) {
    // Approve properties...
    let transaction = await realEstate
      .connect(seller)
      .approve(escrow.address, i + 1);
    await transaction.wait(1);
  }

  // Listing properties...
  transaction = await escrow
    .connect(seller)
    .list(1, buyer.address, tokens(20), tokens(10));
  await transaction.wait(1);

  transaction = await escrow
    .connect(seller)
    .list(2, buyer.address, tokens(15), tokens(5));
  await transaction.wait(1);

  transaction = await escrow
    .connect(seller)
    .list(3, buyer.address, tokens(10), tokens(5));
  await transaction.wait(1);

  console.log(`Finished.`);

  //const basicNftTwo = await deploy("BasicNftTwo", {
  //   from: deployer,
  // args: args,
  // log: true,
  // waitConfirmations: waitBlockConfirmations,
  //})*/

  // Verify the deployment
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log("Verifying...");
    await verify(escrow.address, args);
  }
  log("----------------------------------------------------");
};

module.exports.tags = ["all", "escrow"];
