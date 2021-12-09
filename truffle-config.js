const path = require("path");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      port: 7545,
    },
  },
  compilers: {
    solc: {
      version: "^0.8.6", // A version or constraint - Ex. "^0.5.0"
      // Can be set to "native" to use a native solc or
      // "pragma" which attempts to autodetect compiler versions
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    },
  },
};
