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

function getDynamicOutputFile() {
  const date = new Date();
  const formattedDate = date.toISOString().replace(/[:.]/g, '-');
  return `gas-report-${formattedDate}`;
}
const minimist = require('minimist');
const argv = minimist(process.argv.slice(2));
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    // polygon - if doesn't works use POLYGONSCAN_API_KEY
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [
        process.env.PRIVATE_KEY1,
        process.env.PRIVATE_KEY2,
        process.env.PRIVATE_KEY3,
      ],
    },
    sepolia: {
      url: `https://eth-sepolia-public.unifra.io`,
      accounts: [
        process.env.PRIVATE_KEY1,
        process.env.PRIVATE_KEY2,
        process.env.PRIVATE_KEY3,
      ],
    },
  },
  // etherscan: {
  //   // apiKey: process.env.POLYGONSCAN_API_KEY,
  //   apiKey: process.env.ALCHEMY_API_KEY,
  // },
  //https://medium.com/@abhijeet.sinha383/how-to-calculate-gas-and-costs-while-deploying-solidity-contracts-and-functions-54007d321626
  gasReporter: {
    enabled: true,
    noColors: false,
    currency: "EUR",
    token: "MATIC",
    L1: "polygon",
    currencyDisplayPrecision: 4,
    reportFormat: "markdown",
    // outputFile:  getDynamicOutputFile()+'.md' ,
    outputFile:  'gas-report-'+argv._[1].split('/').pop().split('.')[0]+'.md' ,
    forceTerminalOutput: true,
    forceTerminalOutputFormat: "terminal",
    // outputJSONFile	:  getDynamicOutputFile()+'.json', 
    // outputJSON: true,
    // to see the the value of gasPrice it's is enough check the website:
    // https://polygonscan.com/ on the top right corner at the voice - Gas: gwei.
    // while for the MATIC price in euro, it is enough to use the COINMARKET_API which provides
    // a value MATIC PRICE IN EURO that can be double checked in the previous website.
    coinmarketcap: process.env.COINMARKET_API_KEY,
    gasPrice: 30.1
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: {
          viaIR: true,
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
};
