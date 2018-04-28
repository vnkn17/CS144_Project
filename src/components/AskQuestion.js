import React, { Component } from 'react';
import firebase from 'firebase';

const INITIAL_STATE = {
  question: '',
  numTokens: '',
  resolveDate: '',
  error: null,
};

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

export default class AskQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {INITIAL_STATE};
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log("email: " + firebase.auth().currentUser.email);
      } else {
        window.location.href = '/signin';
      }
    });
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
    const {
      question,
      numTokens,
      resolveDate,
      error,
    } = this.state;

    console.log("submit clicked");

    var database = firebase.database();
    var currentUser = firebase.auth().currentUser;
    var email;
    if (currentUser != null) {
      email = (currentUser.email).replace(/\./g, '_');
      console.log("submit email: " + email);
    }
    console.log('/users/emailsToIDs/' + email);

    var userID;
    var solidityQuestionId = 0;
    event.preventDefault();

    database.ref('/users/emailsToIDs/' + email).once("value").then(function(snapshot) {
      userID = snapshot.val().userID;

      database.ref('/questions/questionCount').once("value").then(function(snapshot) {
        if (!snapshot.exists()) {
          database.ref('/questions').set({
            questionCount : 1,
            questionData : {},
            unresIndex : 1,
            unresolved : {},
          });
          database.ref('/questions/questionData/' + 0).set({
            // questionID : 0,
            askerID : userID,
            text : question,
            tokensPledged : numTokens,
            resolveDate : resolveDate,
            resolved : 'false',
            correctAnswer : ''
          });
          database.ref('/questions/unresolved/' + 0).set({
            questionID: 0,
            askerID: userID,
            done: false

          });

        }
        else {
          var newQuestionId;
          database.ref('/questions/questionCount').once("value").then(function(snapshot) {
            newQuestionId = Number(snapshot.val());
            solidityQuestionId = newQuestionId;
            database.ref('questions/questionCount').set(newQuestionId + 1);
            database.ref('questions/questionData/' + newQuestionId).set({
              // questionID : newQuestionId,
              askerID : userID,
              text : question,
              tokensPledged : numTokens,
              resolveDate : resolveDate,
              resolved : 'false',
              correctAnswer : ''
            });
            var newUnresIndex;
            database.ref('/questions/unresIndex').once("value").then(function(snapshot) {
              newUnresIndex = Number(snapshot.val());

              database.ref('/questions/unresIndex').set(newUnresIndex + 1);
              database.ref('/questions/unresolved/' + newUnresIndex).set({
                questionID: newQuestionId,
                askerID: userID,
                done: false

              });
            });
          });
        }

        database.ref('/users/userData/' + userID + '/numQuestions').once("value").then(function(snapshot) {
          console.log("snapshot:\n" + snapshot.val());
          var currentQuestionNum = Number((snapshot.val()));
          console.log("currentQuestionNum: " + currentQuestionNum);
          database.ref('/users/userData/' + userID + '/numQuestions').set(1); //////////
          database.ref('/users/userData/' + userID + '/numTokens').once("value").then(function(snapshot) {
            var currentTokenNum = Number((snapshot.val()));
            database.ref('/users/userData/' + userID + '/numTokens').set(currentTokenNum - Number(numTokens));
            window.location.href = '/askquestion';
          });
        });
      });
    });

    // Solidity Integration.
    var transactionContract = this.props.transcontract;
    var transactionInstance;
    console.log("solidityQuestionId: ", solidityQuestionId);

    this.props.web.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];
      transactionContract.deployed().then(function(instance) {
        transactionInstance = instance;


        // Execute adopt as a transaction by sending account
        transactionInstance.addQuestioner(account, numTokens, solidityQuestionId, {from: account}).then(function(result) {
          return transactionInstance.getBalance.call(account);
        }).then(function(current_balance) {
          console.log("Current balance: ", current_balance.toNumber());
        });


      });
    });
  }

  render () {
    const {
      question,
      numTokens,
      resolveDate,
      error,
    } = this.state;

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
              <a href="answerquestion" className='href'> Answer Question</a>
            </div>
            <div className='linkBox'>
              <a href="pledgetokens" className='href'> Pledge Tokens</a>
            </div>
            <div className='linkBox'>
              <a href="reviewtokens" className='href'> Review Tokens</a>
            </div>
          </div>
        </div>
      	<h1 className='title1'> Post a question! </h1>
      	<form className='questionForm' onSubmit = {this.onSubmit}>
      		<input
      			className='questionBox'
            type='text'
            placeholder='Write question here...'
            value={question}
            onChange={event => this.setState(byPropKey('question', event.target.value))}
      		/>
      		<div className='extras'>
      			<h5 className='title2'>Tokens </h5>
      			<input
      				className='tokens'
      				type='number'
      				value={numTokens}
      				placeholder='Pledge tokens'
              onChange={event => this.setState(byPropKey('numTokens', event.target.value))}
      			/>
      			<h5 className='title2'>Resolve Date </h5>
      			<input
      				className='resolveDate'
      				type='date'
      				placeholder='Resolve date'
              value={resolveDate}
              onChange={event => this.setState(byPropKey('resolveDate', event.target.value))}
      			/>
      		</div>
      		<button className='submitButton' type='submit'>
      		  Submit
      		</button>
      	</form>
        <button className='submitButton' onClick={this.logoutClick}>Log Out User</button>
      </div>
    )
  }
}
