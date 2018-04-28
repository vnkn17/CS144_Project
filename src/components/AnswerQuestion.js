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
  numTokens: 420,
  currentAnswerList : [],
  proposedAnswer : '',
  error : null,
  answerableCarry : [],
};

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

var globalAnswers = [];

var selectedValues = [];

function waitUntilDefined() {
  if (typeof globalAnswers !== 'undefined' && typeof globalAnswers[0] != 'undefined') {
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
      dropdownOpen: false
    };
  
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log("email: " + firebase.auth().currentUser.email);
      } else {
        window.location.href = '/signin';
      }
    });

    this.render();

    window.onload = function() {
      // alert(document.getElementById("selectorBox"));
      console.log("nice meme dank meme");
      // Parsing available questions to answer with Firebase:
      var database = firebase.database();
      var answerableInds = [];
      var dropdownSelector = document.getElementById("selectorBox");
      console.log("selector: " + dropdownSelector);

      database.ref('/questions/unresolved').once("value").then(function(snapshot) {
        var dict = snapshot.val();
        console.log(dict);
        for (var key in dict) {
          answerableInds.push(dict[key]);
        }
        console.log('check2');

        database.ref('/questions/questionData').once("value").then(function(snapshot) {
          console.log("BIG TEST: " + snapshot.val()[0].text);

          console.log(answerableInds);
          var snap = snapshot.val();

          for (var ind in answerableInds) {
            var qInfo = snap[answerableInds[ind].questionID];
            globalAnswers.push(qInfo);
          }

          console.log(globalAnswers);
          console.log(globalAnswers[0]);
          console.log("lol: " + globalAnswers[0].text);

          console.log('answerable2 is');
          console.log("answerableCarry:\n" + JSON.stringify(globalAnswers));
          let answerable = globalAnswers;
          let l = 4;
          let items=[];
          var i = 0
          for (var item in globalAnswers) {
              console.log(globalAnswers[item]);
              var optText = globalAnswers[item].text + " | " + globalAnswers[item].tokensPledged + " Tokens";
              var optValue = [item, globalAnswers[item].askerID];
              var el = document.createElement("option");
              el.textContent = optText;
              el.value = optValue;
              dropdownSelector.appendChild(el);
              // items.push(<option key={i} value={globalAnswers[item].text}>{globalAnswers[item].text}</option>);
              // i++;
              //here I will be creating my options dynamically based on
              //what props are currently passed to the parent component
          }
          console.log(items);
          return items;
        });
      });
    };
  }

onDropdownSelected(e) {
    console.log("THE VAL", e.target.value);
    selectedValues = e.target.value;
    //here you will see the current selected value of the select input
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

  onSubmit = (event) => {
    event.preventDefault();

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
    console.log("selectedQuestionID: " + selectedQuestionID);

    // database.ref('/questions/questionData/' + selectedQuestionID + '/askerID').once("value").then(function(snapshot) {
    //   var askerID = Number(snapshot.val());

      database.ref('/users/emailsToIDs/' + email + '/userID').once("value").then(function(snapshot) {
        console.log("Debugging issue: ", Number(snapshot.val()));
        currentUserID = Number(snapshot.val());
        console.log("currentUserID: " + currentUserID);

        if (currentUserID === askerID) {
          // RETURN ERROR MESSAGE SAYING YOU CANNOT ANSWER YOUR OWN QUESTION
          window.location.href = "/askquestion";
        }
        else {
          // window.location.href = "/askquestion";
          database.ref('/questions/questionData/' + selectedQuestionID + '/answers').once("value").then(function(snapshot) {
            // Do some stuff with parsing and attaching to answers array.
            // Need to deal with answer IDs, and other such things.
            // See User storage and question storage for examples.
            if(!snapshot.exists()) {
              database.ref('/questions/questionData/' + selectedQuestionID + '/answers').set({
                answerCount : 1,
                answerData : {}
              });
              database.ref('/questions/questionData/' + selectedQuestionID + '/answers/answerData/0').set({
                answererID : currentUserID,
                answerText : proposedAnswer,
                tokensAwarded : 0
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
                  tokensAwarded : 0
                });
              });
            }
          });
        }
      });
    // });

    // database.ref('/questions/')
    // Solidity Integration.
    var transactionContract = this.props.transcontract;
    var transactionInstance;

    this.props.web.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];
      transactionContract.deployed().then(function(instance) {
        transactionInstance = instance;

        // Execute adopt as a transaction by sending account
        transactionInstance.addAnswerer(account, selectedQuestionID, {from: account}).then(function(result) {
          console.log("Added Answerer Success", result.toString());
        });

      });
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
        <div className='answQBox'>
            <form className='answer_parentBox' onSubmit={this.onSubmit}>
            <label className='labelBox'>
              <div className='tokenDisplay'>
                <h4 className='tokenText'>You own {this.state.INITIAL_STATE.numTokens} Tokens</h4>
                <a className='tokenText1' href='www.google.com'>Buy more</a>
              </div>            
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
              onSubmit={event=>event.preventDefault()}
            >
            Submit
            </button>
            </form>
        </div>
        <div className='logOutBox'>
          <button className='submitButton9' onClick={this.logoutClick}>Log Out</button>
        </div>        
      </div>
    )
  }
};
