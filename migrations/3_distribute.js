var Distribute = artifacts.require("./Distribute.sol");
var Transaction = artifacts.require("./Transaction.sol");


module.exports = function(deployer) {
  deployer.deploy(Distribute, 0, "QuestToken", "QT").then(function() {
        return deployer.deploy(Transaction, Distribute.address);
    }).then(function() { })
};
