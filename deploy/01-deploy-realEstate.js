const { network, ethers } = require("hardhat");
const {
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  let { deployer } = await getNamedAccounts();
  const seller = deployer;
  const waitBlockConfirmations = developmentChains.includes(network.name)
    ? 1
    : VERIFICATION_BLOCK_CONFIRMATIONS;

  log("----------------------------------------------------");
  const arguments = [];
  const realEstate = await deploy("RealEstate", {
    from: deployer,
    args: arguments,
    log: true,
    waitConfirmations: waitBlockConfirmations,
  });
  //await realEstate.deployed();
  
    const realEstateContract = await ethers.getContract("RealEstate");

    console.log(`Deployed Real Estate Contract at: ${realEstateContract.address}`);
    console.log(`Minting a properties...\n`);

  //for (let i = 0; i < 3; i++) {
    const transaction = await realEstateContract.mint(
    `https://ipfs.io/ipfs/QmQVcpsjrA6cr1iJjZAodYwmPekYgbnXGo4DFubJiLc2EB/1.json`
    );
    await transaction.wait();
    
  

  // Verify the deployment
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log("Verifying...");
    await verify(realEstate.address, arguments);
  }
  log("----------------------------------------------------");
};

module.exports.tags = ["all", "realestate"];
