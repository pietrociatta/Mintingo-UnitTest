require('@nomicfoundation/hardhat-toolbox');
require('hardhat-contract-sizer');
require('@nomiclabs/hardhat-etherscan');

const PRIVATE_KEY =
  'd7f6b8e2ac8953bb73577b0b4b5d4af07dcf07c811ab017799d7ce4d5643f0c3';

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: '0.8.17',
    settings: {
      optimizer: {
        enabled: true,
        runs: 100,
        details: {
          yul: true,
          yulDetails: {
            stackAllocation: true,
            optimizerSteps: 'dhfoDgvulfnTUtnIf',
          },
        },
      },
    },
  },
  networks: {
    goerli: {
      url: `https://multi-yolo-dew.ethereum-goerli.quiknode.pro/f1f8feb2d55e163b1f29b09f1f05b88bac56c270/`,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    bsc: {
      url: `https://few-solitary-grass.bsc-testnet.quiknode.pro/c1d74be9350b00b1389b1a82cbf0f58685714d63/`,
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true,
    only: [],
  },
  etherscan: {
    apiKey: { bscTestnet: '2NNPAT6J5JYUXGPAERRI178PZXGMYQI7FJ' },
  },
};
