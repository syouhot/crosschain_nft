const { network, companionNetworks } = require("hardhat");

require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ethers");
require("hardhat-deploy");
require("hardhat-deploy-ethers");
require("./task")
/** @type import('hardhat/config').HardhatUserConfig */
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const SEPLOLIA_RPC_RUL = process.env.SEPLOLIA_RPC_RUL;
const AMOY_RPC_URL = process.env.AMOY_RPC_URL;
module.exports = {
  solidity: "0.8.24",
  namedAccounts:{
    firstAccount:{
      default:0
    },
    secondAccount:{
      default:1
    }
  },
  network: {
    sepolia: {
      url: SEPLOLIA_RPC_RUL,
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
      blockConfirmations: 6,
      companionNetworks: {
        destChain: "amoy",
      }
    },
    amoy: {
      url: AMOY_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 80002,
      blockConfirmations: 6,
      companionNetworks: {
        destChain: "sepolia",
      }
    }
  },
  gasReporter: {
    enabled: false,
  }
};
