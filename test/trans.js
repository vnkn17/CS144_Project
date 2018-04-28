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
                  return trans.addQuestioner(accounts[0], 2, 1);
            }).then(function (result) {
                  //console.log(result);
                  return trans.getBalance.call(accounts[0]);
            }).then(function(stuff) {
                //console.log(stuff);
                yo = stuff.toNumber();
                assert.equal(yo, 8, "Testing balance");
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
                yo = stuff.toNumber();
                assert.equal(yo, 10, "Testing balance");
            });
      });

      it("Adding another answerer, answerer distribution, check token amount", function () {
            var trans;
            return Transaction.deployed().then(function(instance) {
                  trans = instance;
                  return trans.addAnswerer(accounts[2], 1);
            }).then(function (result) {
                  //console.log(result);
                  var distribution = [1, 1];
                  return trans.addAnswererDistribution(distribution, 1);
            }).then(function(stuff) {
                  return trans.executeTransaction(1);
            }).then(function(stuff) {
                  return trans.getBalance.call(accounts[1]);
            }).then(function(stuff) {
                //console.log(stuff);
                yo = stuff.toNumber();
                assert.equal(yo, 11, "Testing balance");
                return trans.getBalance.call(accounts[2]);

            }).then(function(stuff) {
                //console.log(stuff);
                yo = stuff.toNumber();
                assert.equal(yo, 11, "Testing balance");

            });
      });





});
