require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      
      
      {
        version: '0.6.6',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.7.0',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.8.10',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.5.0',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.5.16",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.6.12',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.7.6',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.5.16",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },

  defaultNetwork: "Ropsten",
  abiExporter: {
    path: './deployments/abi',
    clear: true,
    flat: true,
    only: [],
    spacing: 2,
    pretty: true,
  },

  networks: {
    bscTest: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/", // BSC Testnet
      chainId: 97,
      accounts: ["0x7c45631950e456dc219fa14311b3dc624d7a2016e760229a2f9be4e2a557d9cb"]
    },
    Ropsten: {
      url: "https://ropsten.infura.io/v3/4a1e18fae3064bb08cb32f881e43f063",
      chainId: 3,
      accounts: ["0x7c45631950e456dc219fa14311b3dc624d7a2016e760229a2f9be4e2a557d9cb"]
    },
    Rinkeby: {
      url: "https://rinkeby.infura.io/v3/4a1e18fae3064bb08cb32f881e43f063",
      chainId: 4,
      accounts: ["0x7c45631950e456dc219fa14311b3dc624d7a2016e760229a2f9be4e2a557d9cb"]
    }
  }
};
