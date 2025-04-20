const LoyaltyPointExchange = artifacts.require("LoyaltyPointExchange");

module.exports = async function (deployer) {
  await deployer.deploy(LoyaltyPointExchange);
  const instance = await LoyaltyPointExchange.deployed();
  console.log("✅ Deployed LoyaltyPointExchange at address:", instance.address);
};
