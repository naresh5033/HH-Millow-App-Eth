# Real Estate NFT DApp

## Technology Stack & Tools

- Solidity (Writing Smart Contracts & Tests)
- Javascript (React & Testing)
- [Hardhat](https://hardhat.org/) (Development Framework)
- [Ethers.js](https://docs.ethers.io/v5/) (Blockchain Interaction)
- [React.js](https://reactjs.org/) (Frontend Framework)

## Requirements For Initial Setup
- Install [NodeJS](https://nodejs.org/en/)

## Setting Up
### 1. Clone/Download the Repository

### 2. Install Dependencies:
`$ npm install`

### 3. Run tests
`$ npx hardhat test`

### 4. Start Hardhat node
`$ npx hardhat node`

### 5. Run deployment script
In a separate terminal execute:
`$ npx hardhat run ./scripts/deploy.js --network localhost`

### 7. Start frontend
`$ npm run start`
## Millow

Just like the zillow app this is an real estate application. But in a decentralized way.
The realEstate.sol is a ERC21 storage, once we deploye the SC the users can be able to mint the nft (token Uri) - which is the meta data of the houses that has been deployed in the ipfs node.
Then the Escrow.sol is like a crowd funding contract it requires seller(deployer), buyer, the inspector, lender(money lender).
Only the seller can deploy with the above mentioned args and then for listing the prop the seller has to approve.

Once the property(nft) has been listed, then it can be visible and the users can see how much they can be able to get from the escrow, then they can make a request of certain amt in the escrow which can later be verified and approved by the inspector and the lender.
Once verification is done the buyer can get the requested money from the lender and then proceed to purchase the listed prop from the seller.

## Deployed App 

This is a react Dapp. 
For the block chain part i ve used HH frame work.
The contract is deployed and verified in the  in the goerli network and the deployed addr for the Real estate contract is  - "0x1E3b058E906931A654d18fC96Ac9B07a7667599c"
and the escrow is = "0x606833cd202eb5a418159509f5f6276cbb2a187a"

The Dapp is deployed in the 
