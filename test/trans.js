var Transaction = artifacts.require("./Transaction.sol");

contract('Transaction', function(accounts) {
    it("Checking correct initialization", function() {
            var trans;
            return Transaction.deployed().then(function(instance) {
                trans = instance;
                return trans.accountCreation(accounts[0]);
            }).then(function (result) {
                return trans.getBalance.call(accounts[0]);
            }).then(function(stuff) {
                console.log(stuff);
                yo = stuff.toNumber();
                assert.equal(yo, 10, "Testing Initials");
            });
        });

      it("Checking correct initialization again", function() {
              var trans;
              return Transaction.deployed().then(function(instance) {
                    trans = instance;
                    return trans.accountCreation(accounts[1]);
              }).then(function (result) {
                  return trans.getBalance.call(accounts[1]);
              }).then(function(stuff) {
                  //console.log(stuff);
                  yo = stuff.toNumber();
                  assert.equal(yo, 10, "Testing Initials");
              });
          });

          it("Checking correct initialization again", function() {
                  var trans;
                  return Transaction.deployed().then(function(instance) {
                        trans = instance;
                        return trans.accountCreation(accounts[2]);
                  }).then(function (result) {
                      return trans.getBalance.call(accounts[2]);
                  }).then(function(stuff) {
                      //console.log(stuff);
                      yo = stuff.toNumber();
                      assert.equal(yo, 10, "Testing Initials");
                  });
              });

      it("Adding questioner and check balance value", function () {
            var trans;
            return Transaction.deployed().then(function(instance) {
                  trans = instance;
                  //console.log(accounts[0]);
                  return trans.addQuestioner(accounts[0], 6, 1);
            }).then(function (result) {
                  //console.log(result);
                  return trans.getBalance.call(accounts[0]);
            }).then(function(stuff) {
                //console.log(stuff);
                yo = stuff.toNumber();
                assert.equal(yo, 4, "Testing balance");
            });
      });

      it("Adding account 1 answerer", function () {
            var trans;
            return Transaction.deployed().then(function(instance) {
                  trans = instance;
                  return trans.addAnswerer(accounts[1], 1);
            }).then(function (result) {
                  console.log(result);
                  return trans.getBalance.call(accounts[1]);
            }).then(function(stuff) {
                console.log(stuff);
                //yo = stuff.toNumber();
                //assert.equal(yo, 10, "Testing balance");
                return trans.addAnswerer(accounts[2], 1);
            }).then(function(stuff) {
                var distr = [2, 4];
                return trans.executeTransaction(distr, 1);
            }).then(function(stuff) {
                return trans.getBalance.call(accounts[1]);
            }).then(function(stuff) {
                assert.equal(stuff.toNumber(), 12, "Testing distribution to account 2...");
            });
      });




});
