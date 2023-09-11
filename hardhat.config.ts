require("@nomiclabs/hardhat-ganache");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("@nomicfoundation/hardhat-toolbox");

// Example that belongs to the HardHat package
//import { HardhatUserConfig } from "hardhat/config";

// const config: HardhatUserConfig = {
//   solidity: "0.8.18",
// };

// export default config;




// /**** DA VEDERE PER MULTIPLE RETI
//  * 
//  * https://github.com/mstable/mStable-contracts/blob/master/hardhat.config.ts
//  */


// /*  Esempio from Polygon website */
require("dotenv").config();

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    // polygon - if doesn't works use POLYGONSCAN_API_KEY
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [process.env.PRIVATE_KEY],
    },
    sepolia: {
      url: `https://eth-sepolia-public.unifra.io`,
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  etherscan: {
    // apiKey: process.env.POLYGONSCAN_API_KEY,
    apiKey: process.env.ALCHEMY_API_KEY,
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
