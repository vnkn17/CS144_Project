pragma solidity ^0.4.17;
import "./Distribute.sol";


contract Transaction {
  // Tracks the addres of the questioner, index of the question.
  mapping(uint => address) public questionTracker;

  // Tracks the tokens pledged, index of the question.
  mapping(uint => uint) public questionValue;

  // Tracks the id to an array of addresses of answerers.
  mapping (uint => address[]) public answererTracker;

  // Tracks the id to an array of tokens rewarded to the answerers.
  mapping (uint => uint[]) public tokensRewarded;

  // Address of the deployed contract of Distribute contract.
  address bank;
  Distribute instanceDistribute;


  function Transaction(
    address distributeAddress
  ) public {
    instanceDistribute = Distribute(distributeAddress);
  }

  function accountCreation(address _account) public returns (bool success) {
      //Distribute instanceDistribute = Distribute(bank);
      return instanceDistribute.accountCreation(_account);
  }

  function getBalance(address _account) public returns (uint){
      //Distribute instanceDistribute = Distribute(bank);
      return instanceDistribute.balanceOf(_account);
  }


  // If enough in balance, subtracts from account, sets to questioner public variable, and
  // returns true. Else, return false.
  function addQuestioner(address _questioner, uint _value, uint _id)
      public returns (bool success) {
      if(instanceDistribute.checkBalance(_questioner, _value)) {
        questionTracker[_id] = _questioner;
        questionValue[_id] = _value;
        return true;
      }
      else {
        return false;
      }
  }

  // Function adds answerer to the contract.
  function addAnswerer(address _answerer, uint _id)
      public returns (bool success) {

      answererTracker[_id].push(_answerer);
      return true;
  }

  // Function adds token distributions to the tokensRewarded public variables.
  // Assumes distribution sums up to proper value.
  function addAnswererDistribution(uint[] distribution, uint _id)
      public returns (bool success) {

      tokensRewarded[_id] = distribution;
      return true;
  }

  // Function distributes token from the tokensRewarded variable.
  function executeTransaction(uint _id)
      public returns (bool success) {

      //Distribute instanceDistribute = Distribute(bank);

      for(uint i = 0; i < answererTracker[_id].length; i++) {
        bool process = instanceDistribute.addTokens(answererTracker[_id][i], tokensRewarded[_id][i]);
        if(!process) {
          return false;
        }
      }
      return true;
  }



}
