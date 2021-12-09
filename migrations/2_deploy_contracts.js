var Application = artifacts.require('./Application.sol');

module.exports = function (deployer) {
  deployer.deploy(Application);
};
