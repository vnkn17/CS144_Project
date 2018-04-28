pragma solidity ^0.4.17;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Distribute.sol";


contract TestDistribute {

  Distribute distribute = Distribute(DeployedAddresses.Distribute());

  // Testing the initial account function
  function testInitialAccount() public {
    address cur = this;
    bool stuff = distribute.accountCreation(this);
    uint returnedCreation = distribute.balanceOf(cur);

    //uint returnedCreation = returnedBalance[cur];

    uint expectedCreation = 10;
    Assert.equal(expectedCreation, returnedCreation, "Checking account creation...");


    //address second = 0x038Bb13f16fA39A92849D676f8e4A0515C2e465a;
    //stuff = distribute.accountCreation({from: second});
    //returnedCreation = distribute.balanceOf(second);

    //Assert.equal(expectedCreation, returnedCreation, "Second checking account creation...");

  }



}
