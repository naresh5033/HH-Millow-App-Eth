const { network } = require("hardhat");
const {
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  let { deployer, inspector, lender, buyer } = await getNamedAccounts();
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

  console.log(`Deployed Real Estate Contract at: ${realEstate.address}`);
  console.log(`Minting 3 properties...\n`);

  for (let i = 0; i < 3; i++) {
    const transaction = await realEstate.mint(
      `https://ipfs.io/ipfs/QmQVcpsjrA6cr1iJjZAodYwmPekYgbnXGo4DFubJiLc2EB/${
        i + 1
      }.json`
    );
    await transaction.wait();

    const inspectorAddress = "0x10c8B70284BA45134e0BAa7fCcc36D07B4290EDa";
    const lenderAddress = "0x695960BCdCa8B55AEc37B64500Bd64B4BBFe4fFf";
    const args = [realEstateAddress, seller, inspectorAddress, lenderAddress];
    const escrow = await deploy("Escrow", {
      from: deployer,
      args: args,
      log: true,
      waitConfirmations: waitBlockConfirmations,
    });
    //await escrow.deployed();

    console.log(`Deployed Escrow Contract at: ${escrow.address}`);
    console.log(`Listing 3 properties...\n`);

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

    console.log(`Finished......`);

    // Verify the deployment
    if (
      !developmentChains.includes(network.name) &&
      process.env.ETHERSCAN_API_KEY
    ) {
      log("Verifying...");
      await verify(realEstate.address, arguments);
      await verify(escrow.address, arguments);
    }
    log("----------------------------------------------------");
  }
};

module.exports.tags = ["all", "realestate"];
