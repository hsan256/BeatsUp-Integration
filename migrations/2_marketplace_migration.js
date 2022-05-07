const MarketplaceMigration = artifacts.require("CollectionMarketplace");

module.exports = function (deployer) {
  deployer.deploy(MarketplaceMigration);
};