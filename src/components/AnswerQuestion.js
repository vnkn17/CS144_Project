import React, { Component } from 'react'
import { Dropdown, DropdownMenu, DropdownToggle } from 'reactstrap';
import { Button } from 'reactstrap';
import GithubUsers from './helpers/GithubUsers';
import ReactDOM from 'react-dom';
import firebase from 'firebase';

const INITIAL_STATE = {
  // selectedQuestionID : -1,
  askerID : -1,
  tokensInEscrow : 0,
  resolveDate : '',
  selectedQuestionText : '',
  currentAnswerList : [],
  proposedAnswer : '',
  error : null,
  answerableCarry : [],
};

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

var unresolvedQuestionData = [];

var selectedValues = [];

function waitUntilDefined() {
  if (typeof unresolvedQuestionData !== 'undefined' && typeof unresolvedQuestionData[0] != 'undefined') {
    return;
  }
  else {
    setTimeout(waitUntilDefined, 50);
  }
}

export default class AnswerQuestion extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      INITIAL_STATE,
      test: [],
      dropdownOpen: false,
      numTokens: 420,
    };

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log("email: " + firebase.auth().currentUser.email);
      } else {
        window.location.href = '/signin';
      }
    });

    this.render();

    console.log(firebase.auth().currentUser);

    window.onload = function() {
      // Parsing available questions to answer with Firebase:
      var database = firebase.database();
      var answerableInds = [];
      var dropdownSelector = document.getElementById("selectorBox");
      console.log("selector: " + dropdownSelector);

      database.ref('/questions/unresolved').once("value").then(function(snapshot) {

        var unresolvedDict = snapshot.val()
        var qID = []
        for (var key in unresolvedDict) {
          if (!unresolvedDict[key].done) {
            answerableInds.push(unresolvedDict[key]);
          }
        }

        database.ref('/questions/questionData').once("value").then(function(snapshot) {

          var snap = snapshot.val();
          for (var ind in answerableInds) {
            var qInfo = snap[answerableInds[ind].questionID];
            qID.push(answerableInds[ind].questionID)
            unresolvedQuestionData.push(qInfo);
          }

          let l = 4;
          let items=[];
          var i = 0
          console.log(unresolvedQuestionData);
          for (var item in unresolvedQuestionData) {
              var optText = unresolvedQuestionData[item].text + " | " + unresolvedQuestionData[item].tokensPledged + " Tokens";
              var optValue = [qID[item], unresolvedQuestionData[item].askerID];
              var el = document.createElement("option");
              el.textContent = optText;
              el.value = optValue;
              dropdownSelector.appendChild(el);

          }
          return items;
        });
      });
    };
  }

  logoutClick = () => {
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
      console.log("Succesful signing out.");

    }, function(error) {
      // An error happened.
      console.log("Error in signing out.");
    });
  }

  onDropdownSelected(e) {
      selectedValues = [Number(e.target.value.split(',')[0]), Number(e.target.value.split(',')[1])];
      console.log(selectedValues);
      //here you will see the current selected value of the select input
  }

  onSubmit = (event) => {
    event.preventDefault();

    console.log("HERE");
    const {
      // selectedQuestionID,
      askerIDb,
      tokensInEscrowb,
      resolveDateb,
      selectedQuestionTextb,
      currentAnswerListb,
      proposedAnswer,
      error,
    } = this.state;

    /*FIREBASE STUFF GOES HERE*/
    var database = firebase.database();

    var currentUser = firebase.auth().currentUser;
    var email;
    if (currentUser != null) {
      email = (currentUser.email).replace(/\./g, '_');
      console.log("submit email: " + email);
    }
    var currentUserID;
    var selectedQuestionID = selectedValues[0]; //document.getElementById("selectorBox").value()[0];
    var askerID = selectedValues[1]; //document.getElementById("selectorBox").value()[1];
    console.log("selectedvalues", selectedValues);
    console.log("QID", selectedQuestionID);
    console.log("askerID", askerID);


    // database.ref('/questions/questionData/' + selectedQuestionID + '/askerID').once("value").then(function(snapshot) {
    //   var askerID = Number(snapshot.val());

    console.log('/users/emailsToIDs/' + email + '/userID');
    database.ref('/users/emailsToIDs/' + email + '/userID').once("value").then(function(snapshot) {
      console.log("Debugging issue: ", Number(snapshot.val()));
      currentUserID = Number(snapshot.val());
      console.log("currentUserID: " + currentUserID);

      if (currentUserID === askerID) {
        // RETURN ERROR MESSAGE SAYING YOU CANNOT ANSWER YOUR OWN QUESTION
        alert('Error: Cannot answer your own question!');
        window.location.href = "/askquestion";
      }
      else {
        console.log("1");
        // window.location.href = "/askquestion";
        database.ref('/questions/questionData/' + selectedQuestionID + '/answers').once("value").then(function(snapshot) {
          // Do some stuff with parsing and attaching to answers array.
          // Need to deal with answer IDs, and other such things.
          // See User storage and question storage for examples.
          console.log("2");
          console.log(selectedQuestionID);

          if(!snapshot.exists()) {
            console.log("3");

            // Insert reviewerCount and reviewerId for the first time.
            database.ref('/questions/questionData/' + selectedQuestionID + '/reviewers').set({
              reviewerCount: 0,
              reviewerData: {}
            });

            database.ref('/questions/questionData/' + selectedQuestionID + '/answers').set({
              answerCount : 1,
              answerData : {}
            });
            console.log("4");

            database.ref('/questions/questionData/' + selectedQuestionID + '/answers/answerData/0').set({
              answererID : currentUserID,
              answerText : proposedAnswer,
              tokensAwarded : 0,
              reviewerRatings: {}
            });
          }
          else {
            var newAnswerID;
            database.ref('/questions/questionData/' + selectedQuestionID + '/answers/answerCount').once("value").then(function(snapshot) {
              newAnswerID = Number(snapshot.val());
              database.ref('/questions/questionData/' + selectedQuestionID + '/answers/answerCount').set(newAnswerID + 1);
              database.ref('/questions/questionData/' + selectedQuestionID + '/answers/answerData/' + newAnswerID).set({
                answererID : currentUserID,
                answerText : proposedAnswer,
                tokensAwarded : 0,
                reviewerRatings: {}
              });
            });
          }
        });
      }
    });
    // });

    console.log("smart");
    // database.ref('/questions/')
    // Solidity Integration.
    var transactionContract = this.props.transcontract;
    console.log(transactionContract);
    var transactionInstance;
    alert('Answer successfully submitted!');

    this.props.web.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
        alert(error);
      }

      var account = accounts[0];
      console.log("Account: ", account);
      transactionContract.deployed().then(function(instance) {
        print("Instance: ", instance);
        transactionInstance = instance;

        // Execute adopt as a transaction by sending account
        transactionInstance.addAnswerer.sendTransaction(account, selectedQuestionID, {from: account, gas: 200000}).then(function(result) {
          console.log("Added Answerer Success", result.toString());
        });

      });
    });

  }

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log("email: " + firebase.auth().currentUser.email);
        firebase.database().ref('/users/user')
        var email = (firebase.auth().currentUser.email).replace(/\./g, '_');
        console.log("wat");
        firebase.database().ref('/users/emailsToIDs/' + email).once("value").then(function(snapshot) {
          console.log("de");
          var currentID = snapshot.val().userID;
          firebase.database().ref('/users/userData/' + currentID + '/numTokens').once("value").then(function(snapshot) {
            console.log("fuk");
            var tkNum = Number(snapshot.val());
            // st.numTokens = tkNum;
            var tokenDisplay = document.getElementsByClassName("tokenDisplay");
            console.log("token display:\n" + tokenDisplay[0].innerHTML);
            // tokenDisplay[0].innerHTML = "You own " + tkNum + " Tokens";
            tokenDisplay[0].innerHTML = "<h4>You own " + tkNum + " Tokens</h4>\
              <a href='/askquestion'>Buy more</a>"
          });
        });
      } else {
        window.location.href = '/signin';
      }
    });
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
    ReactDOM.render(
      <div>
      <GithubUsers label="GitHub users (Async with fetch.js)" />
      </div>
    );
  }

  render() {
    return (
      <div className='mainBox'>
        <div className='headerBox'>
          <div className='linksParentBox'>
            <div className='linkBox'>
              <a href="signin" className='href'>Sign In</a>
            </div>
            <div className='linkBox'>
              <a href="signup" className='href'> Sign Up</a>
            </div>
            <div className='linkBox'>
              <a href="/" className='href'>Home</a>
            </div>
            <div className='linkBox'>
              <a href="askquestion" className='href'> Ask Question</a>
            </div>
            <div className='linkBox'>
              <a href="pledgetokens" className='href'> Pledge Tokens</a>
            </div>
            <div className='linkBox'>
              <a href="reviewtokens" className='href'> Review Tokens</a>
            </div>
          </div>
        </div>
        <div className='tokenDisplay'>
        </div>
        <div className='answQBox'>
          <div>
            <form className='answer_parentBox' onSubmit={this.onSubmit}>
            <label className='labelBox'>
              <h4 className='title1'>Select a question to answer</h4>
              <div className='select_parentBox'>
                <select className='selectBox' id="selectorBox" type="select" onChange={this.onDropdownSelected} label="Multiple Select" multiple>
                </select>
              </div>
            </label>
            <div className='answerBox'>
              <textarea
                className='answerBox1'
                type='text'
                placeholder='Write answer here'
                onChange={event=>this.setState({proposedAnswer: event.target.value})}
              />
            </div>
            <button
              className='submitButton1'
              type='submit'
              value='Submit'
            >
            Submit
            </button>
            </form>
          </div>
        </div>
        <div className='logOutBox'>
          <button className='submitButton9' onClick={this.logoutClick}>Log Out</button>
        </div>
      </div>
    )
  }
};
